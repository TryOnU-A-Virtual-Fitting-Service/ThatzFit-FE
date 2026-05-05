import type { CSSProperties } from 'react';
import { Minimize2 } from 'lucide-react';

import { useFittingModelStore } from '@/Entities/FittingModel';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import {
  Button,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';

const visuallyHiddenStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const ModelZoomDialogContent = () => {
  const copy = getPluginCopy();
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );

  if (!entryWrapper) {
    return null;
  }

  return (
    <DialogContent
      className='z-[10000000]'
      overlayClassName='z-[10000000]'
      showCloseButton={false}
      container={entryWrapper}
      style={{
        position: 'fixed',
        top: '50vh',
        left: '50vw',
        zIndex: 10000000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'min(30.3125rem, calc(100vw - 2rem))',
        height: 'min(37.75rem, calc(100vh - 4rem))',
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: 'calc(100vh - 4rem)',
        padding: '32px',
        translate: 'none',
        transform: 'translate(-50%, -50%)',
        background: '#ffffff',
        border: '1px solid rgba(17, 24, 39, 0.08)',
        borderRadius: '12px',
        boxSizing: 'border-box',
        boxShadow: '0 18px 60px rgba(0, 0, 0, 0.18)',
        overflow: 'hidden',
      }}
    >
      <DialogTitle style={visuallyHiddenStyle}>{copy.model.zoomIn}</DialogTitle>
      <DialogClose asChild>
        <Button
          size='icon'
          aria-label={copy.model.zoomOut}
          className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 cursor-pointer bg-white'
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '28px',
            height: '28px',
            padding: '6px',
            borderRadius: '8px',
            color: '#636364',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          }}
        >
          <Minimize2 style={{ width: '16px', height: '16px' }} />
        </Button>
      </DialogClose>
      <img
        src={currentFittingModel.defaultModelUrl}
        alt={currentFittingModel.imageName}
        draggable={false}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          userSelect: 'none',
        }}
      />
    </DialogContent>
  );
};
