import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import {
  getVirtualFittingApiDisabledMessage,
  IS_VIRTUAL_FITTING_API_DISABLED,
} from '@/Features/Fitting/Config';
import {
  captureDebugInfo,
  captureDebugWarn,
  getBlobDebugDetails,
  getBlobDebugTraceId,
} from '@/Features/Fitting/Model/debug';

import { useFittingStore } from '@/Entities/Fitting';
import { useFittingModelStore } from '@/Entities/FittingModel';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { trackProductEvent } from '@/Shared/Analytics';
import { getPluginCopy } from '@/Shared/Config';
import { useToast } from '@/Shared/Model';

const getDialogWindow = (): Window => {
  try {
    if (window.parent?.document?.body) {
      return window.parent as Window;
    }
  } catch {
    // Cross-origin parents are not readable. Fall back to the plugin frame.
  }

  return window;
};

const getDialogPortalContainer = () => getDialogWindow().document.body;

const getElementDebugDetails = (element: HTMLElement | null) => {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const elementWindow = element.ownerDocument.defaultView ?? window;
  const style = elementWindow.getComputedStyle(element);
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

const getElementStackAtViewportCenter = (targetWindow: Window) => {
  const x = Math.round(targetWindow.innerWidth / 2);
  const y = Math.round(targetWindow.innerHeight / 2);

  return {
    x,
    y,
    elements: targetWindow.document
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
  const copy = getPluginCopy();
  const pluginEntryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );
  const {
    capturedClothingImage,
    isCapturing,
    isFittingDialogOpen,
    isImageProcessing,
    setIsFittingDialogOpen,
    setCapturedClothingImage,
    setFittingJobId,
  } = useFittingStore(
    useShallow((state) => ({
      capturedClothingImage: state.capturedClothingImage,
      isCapturing: state.isCapturing,
      isFittingDialogOpen: state.isFittingDialogOpen,
      isImageProcessing: state.isImageProcessing,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
      setCapturedClothingImage: state.setCapturedClothingImage,
      setFittingJobId: state.setFittingJobId,
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
      !capturedClothingImage
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
    if (!isFittingDialogOpen || !capturedClothingImage) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      const dialogWindow = getDialogWindow();
      const portalContainer = getDialogPortalContainer();

      captureDebugInfo(debugTraceId, 'dialog.dom_visibility_check', {
        viewport: {
          width: dialogWindow.innerWidth,
          height: dialogWindow.innerHeight,
          scrollX: dialogWindow.scrollX,
          scrollY: dialogWindow.scrollY,
        },
        content: getElementDebugDetails(dialogContentRef.current),
        portalContainer: getElementDebugDetails(portalContainer),
        pluginEntryWrapper: getElementDebugDetails(pluginEntryWrapper),
        viewportCenterStack: getElementStackAtViewportCenter(dialogWindow),
      });
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [
    capturedClothingImage,
    debugTraceId,
    isFittingDialogOpen,
    pluginEntryWrapper,
  ]);

  const previewUrl = useMemo(() => {
    if (!capturedClothingImage) {
      return null;
    }

    return URL.createObjectURL(capturedClothingImage);
  }, [capturedClothingImage]);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isFittingDialogOpen) {
      return;
    }

    const dialogWindow = getDialogWindow();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      captureDebugInfo(debugTraceId, 'dialog.escape_key_down');
      setIsFittingDialogOpen(false);
    };

    dialogWindow.document.addEventListener('keydown', handleKeyDown);

    return () => {
      dialogWindow.document.removeEventListener('keydown', handleKeyDown);
    };
  }, [debugTraceId, isFittingDialogOpen, setIsFittingDialogOpen]);

  useEffect(() => {
    captureDebugInfo(debugTraceId, 'dialog.execution_button_render_state', {
      capturedBlob,
      isFittingRequestPending: false,
    });
  }, [capturedBlob, debugTraceId]);

  const handleClickCancelButton = () => {
    captureDebugInfo(debugTraceId, 'dialog.cancel_click', {
      capturedBlob,
    });
    setIsFittingDialogOpen(false);
  };

  const handleClickExecutionButton = () => {
    if (!capturedClothingImage) {
      return;
    }

    captureDebugInfo(debugTraceId, 'dialog.confirm_click', {
      capturedBlob,
      isFittingRequestPending: false,
    });

    if (IS_VIRTUAL_FITTING_API_DISABLED) {
      captureDebugInfo(debugTraceId, 'dialog.confirm_skipped_api_disabled');
      setFittingJobId(null);
      setCapturedClothingImage(null);
      setIsFittingDialogOpen(false);
      toast.success(getVirtualFittingApiDisabledMessage());
      return;
    }

    const fittingRequestId =
      debugTraceId ?? `inline-${Date.now().toString(36)}`;
    trackProductEvent('fitting_request_submitted', {
      fitting_request_id: fittingRequestId,
      default_model_id: currentFittingModel.defaultModelId,
      model_name: currentFittingModel.modelName,
      captured_image_type: capturedClothingImage.type || 'unknown',
      captured_image_size_bytes: capturedClothingImage.size,
    });
    captureDebugInfo(
      debugTraceId,
      'dialog.inline_fitting_request_store_start',
      {
        fittingRequestId,
      },
    );
    useFittingStore.getState().setFittingJobId(fittingRequestId);
    captureDebugInfo(debugTraceId, 'dialog.close_after_inline_fitting_request');
    setIsFittingDialogOpen(false);
  };

  if (!capturedClothingImage || !previewUrl || !isFittingDialogOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={dialogContentRef}
      role='dialog'
      aria-modal='true'
      aria-label={copy.fitting.dialogAriaLabel}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        zIndex: 1000004,
        display: 'flex',
        width: '20.5rem',
        maxWidth: '20.5rem',
        transform: 'translate(-50%, -50%)',
        boxSizing: 'border-box',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        border: 'none',
        borderRadius: '0.5rem',
        background: '#ffffff',
        padding: '1.25rem',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        color: '#181a1b',
        fontFamily: "'Pretendard Variable', sans-serif",
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '18rem',
          height: '15.625rem',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: '1px solid #9399a1',
          borderRadius: '0.375rem',
          paddingInline: '1.25rem',
          overflow: 'hidden',
        }}
      >
        <img
          src={previewUrl}
          alt={copy.fitting.previewAlt}
          onLoad={() => {
            captureDebugInfo(
              debugTraceId,
              'dialog.preview_image_load_success',
              {
                capturedBlob,
              },
            );
          }}
          onError={() => {
            captureDebugWarn(debugTraceId, 'dialog.preview_image_load_failed', {
              capturedBlob,
              previewUrl,
            });
          }}
          style={{
            display: 'block',
            height: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        <span
          style={{
            color: '#000000',
            fontSize: '1.0625rem',
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {copy.fitting.confirmTitle}
        </span>
        <span
          style={{
            color: '#9399a1',
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {copy.fitting.confirmHelp}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: '0.5rem',
        }}
      >
        <button
          type='button'
          onClick={handleClickCancelButton}
          style={{
            flexGrow: 1,
            height: '2.5rem',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '0.375rem',
            background: '#f1f2f3',
            color: '#181a1b',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {copy.common.cancel}
        </button>
        <button
          type='button'
          onClick={handleClickExecutionButton}
          style={{
            flexGrow: 1,
            height: '2.5rem',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '0.375rem',
            background: '#181a1b',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 500,
            opacity: 1,
          }}
        >
          {copy.common.confirm}
        </button>
      </div>
    </div>,
    getDialogPortalContainer(),
  );
};
