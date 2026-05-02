import { useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  FittingCancelButton,
  FittingExecutionButton,
} from '@/Features/Fitting';
import {
  captureDebugInfo,
  captureDebugWarn,
  getBlobDebugDetails,
  getBlobDebugTraceId,
} from '@/Features/Fitting/Model/debug';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Dialog, DialogContent, DialogTitle } from '@/Shared/Components';
import { Spinner } from '@/Shared/Ui';

const getElementDebugDetails = (element: HTMLElement | null) => {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const rootNode = element.getRootNode();

  return {
    tagName: element.tagName,
    id: element.id || undefined,
    className:
      typeof element.className === 'string' ? element.className : undefined,
    isConnected: element.isConnected,
    rootNodeName:
      rootNode instanceof ShadowRoot ? 'ShadowRoot' : rootNode.nodeName,
    parent: element.parentElement
      ? {
          tagName: element.parentElement.tagName,
          id: element.parentElement.id || undefined,
          className:
            typeof element.parentElement.className === 'string'
              ? element.parentElement.className
              : undefined,
        }
      : null,
    rect: {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      bottom: Math.round(rect.bottom),
      right: Math.round(rect.right),
    },
    computedStyle: {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      position: style.position,
      zIndex: style.zIndex,
      pointerEvents: style.pointerEvents,
      transform: style.transform,
      top: style.top,
      left: style.left,
      width: style.width,
      height: style.height,
      overflow: style.overflow,
    },
  };
};

const getElementStackAtViewportCenter = () => {
  const x = Math.round(window.innerWidth / 2);
  const y = Math.round(window.innerHeight / 2);

  return {
    x,
    y,
    elements: document
      .elementsFromPoint(x, y)
      .slice(0, 8)
      .map((element) => ({
        tagName: element.tagName,
        id: element.id || undefined,
        className:
          typeof element.className === 'string' ? element.className : undefined,
      })),
  };
};

export const FittingDialog = () => {
  const pluginEntryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const {
    capturedClothingImage,
    isCapturing,
    isFittingDialogOpen,
    isImageProcessing,
    setIsFittingDialogOpen,
  } = useFittingStore(
    useShallow((state) => ({
      capturedClothingImage: state.capturedClothingImage,
      isCapturing: state.isCapturing,
      isFittingDialogOpen: state.isFittingDialogOpen,
      isImageProcessing: state.isImageProcessing,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
    })),
  );

  const debugTraceId = getBlobDebugTraceId(capturedClothingImage);
  const capturedBlob = useMemo(
    () => getBlobDebugDetails(capturedClothingImage),
    [capturedClothingImage],
  );

  useEffect(() => {
    captureDebugInfo(debugTraceId, 'dialog.render_state', {
      isFittingDialogOpen,
      isCapturing,
      isImageProcessing,
      hasPluginEntryWrapper: Boolean(pluginEntryWrapper),
      capturedBlob,
    });

    if (
      isFittingDialogOpen &&
      !isCapturing &&
      !isImageProcessing &&
      (!capturedClothingImage || !pluginEntryWrapper)
    ) {
      captureDebugWarn(
        debugTraceId,
        'dialog.open_without_render_prerequisite',
        {
          hasCapturedClothingImage: Boolean(capturedClothingImage),
          hasPluginEntryWrapper: Boolean(pluginEntryWrapper),
          isCapturing,
          isImageProcessing,
          capturedBlob,
        },
      );
    }
  }, [
    capturedBlob,
    capturedClothingImage,
    debugTraceId,
    isCapturing,
    isFittingDialogOpen,
    isImageProcessing,
    pluginEntryWrapper,
  ]);

  useEffect(() => {
    if (!isFittingDialogOpen || !capturedClothingImage || !pluginEntryWrapper) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      captureDebugInfo(debugTraceId, 'dialog.dom_visibility_check', {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY,
        },
        content: getElementDebugDetails(dialogContentRef.current),
        portalContainer: getElementDebugDetails(pluginEntryWrapper),
        viewportCenterStack: getElementStackAtViewportCenter(),
      });
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [
    capturedClothingImage,
    debugTraceId,
    isFittingDialogOpen,
    pluginEntryWrapper,
  ]);

  const handleOpenChange = (nextOpen: boolean) => {
    captureDebugInfo(debugTraceId, 'dialog.open_change', {
      previousOpen: isFittingDialogOpen,
      nextOpen,
      capturedBlob,
    });
    setIsFittingDialogOpen(nextOpen);
  };

  if (!capturedClothingImage || !pluginEntryWrapper) {
    return null;
  }

  return (
    <Dialog open={isFittingDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTitle className='sr-only'>피팅 실행 Dialog</DialogTitle>
      <DialogContent
        ref={dialogContentRef}
        showCloseButton={false}
        overlayClassName='hidden'
        className='border-none p-5'
        container={pluginEntryWrapper}
        style={{
          zIndex: 1000003,
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '20.5rem',
          maxWidth: '20.5rem',
          transform: 'translate(-50%, -50%)',
          boxSizing: 'border-box',
          border: 'none',
          borderRadius: '0.5rem',
          background: '#ffffff',
          padding: '1.25rem',
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        }}
        onEscapeKeyDown={() => {
          captureDebugInfo(debugTraceId, 'dialog.escape_key_down');
        }}
        onInteractOutside={(event) => {
          captureDebugWarn(debugTraceId, 'dialog.interact_outside_prevented', {
            eventType: event.type,
          });
          event.preventDefault();
        }}
      >
        <DialogTitle className='sr-only'>피팅 실행 Dialog</DialogTitle>
        <div
          className='flex flex-col items-center gap-5'
          style={{
            width: '18rem',
          }}
        >
          <div
            className='flex justify-center rounded-md border-[1px]'
            style={{
              width: '18rem',
              height: '15.625rem',
              borderColor: '#9399a1',
              paddingInline: '1.25rem',
              boxSizing: 'border-box',
            }}
          >
            {isImageProcessing ? (
              <div className='flex h-full w-full items-center justify-center'>
                <Spinner />
              </div>
            ) : (
              <img
                src={URL.createObjectURL(capturedClothingImage)}
                alt='captured clothing image'
                className='mx-5 h-full object-contain'
              />
            )}
          </div>
          <div className='flex flex-col items-center gap-1'>
            <span
              className='text-heading1-semibold text-black'
              style={{ color: '#000000' }}
            >
              이 옷을 입어볼까요?
            </span>
            <span
              className='text-body1-regular text-grey-04'
              style={{ color: '#9399a1' }}
            >
              상/하의만 입어볼 수 있어요.
            </span>
          </div>
          <div className='flex w-full gap-2'>
            <FittingCancelButton />
            <FittingExecutionButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
