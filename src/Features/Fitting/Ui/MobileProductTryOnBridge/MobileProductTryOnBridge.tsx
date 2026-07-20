import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { useFittingModelStore } from '@/Entities/FittingModel';
import { usePluginStore } from '@/Entities/Plugin';

import { trackProductEvent } from '@/Shared/Analytics';
import { getPluginCopy } from '@/Shared/Config';
import { getHostPageUrl } from '@/Shared/Lib';
import { useMobileTouchEnvironment, useToast } from '@/Shared/Model';

import {
  getVirtualFittingApiDisabledMessage,
  IS_VIRTUAL_FITTING_API_DISABLED,
} from '../../Config';
import {
  captureDebugError,
  captureDebugInfo,
  setBlobDebugTraceId,
} from '../../Model/debug';
import {
  fetchMobileProductImageBlob,
  MOBILE_PRODUCT_TRY_ON_REQUEST_EVENT,
  MOBILE_PRODUCT_TRY_ON_STATE_EVENT,
  parseMobileProductTryOnRequest,
} from '../../Model/mobileProductTryOn';

const getHostWindow = () => {
  try {
    if (window.parent?.document?.body) {
      return window.parent;
    }
  } catch {
    // The embedded plugin contract is same-origin. Fall back defensively.
  }
  return window;
};

const dispatchBridgeState = (ready: boolean, busy: boolean) => {
  const hostWindow = getHostWindow();
  hostWindow.dispatchEvent(
    new CustomEvent(MOBILE_PRODUCT_TRY_ON_STATE_EVENT, {
      detail: { ready, busy },
    }),
  );
};

export const MobileProductTryOnBridge = () => {
  const copy = getPluginCopy();
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const isMobileTouchEnvironment = useMobileTouchEnvironment();

  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );
  const { capturedClothingImage, fittingJobId, isImageProcessing } =
    useFittingStore(
      useShallow((state) => ({
        capturedClothingImage: state.capturedClothingImage,
        fittingJobId: state.fittingJobId,
        isImageProcessing: state.isImageProcessing,
      })),
    );

  const isModelReady =
    currentFittingModel.defaultModelId > 0 &&
    currentFittingModel.defaultModelUrl.length > 0;
  const isBusy =
    isPreparing ||
    isImageProcessing ||
    Boolean(capturedClothingImage) ||
    Boolean(fittingJobId);

  useEffect(() => {
    if (!isModelReady || !isMobileTouchEnvironment) {
      dispatchBridgeState(false, false);
    }
  }, [isMobileTouchEnvironment, isModelReady]);

  useEffect(() => {
    if (!isModelReady || !isMobileTouchEnvironment) {
      return;
    }

    const hostWindow = getHostWindow();
    const handleProductTryOnRequest = (event: Event) => {
      const request = parseMobileProductTryOnRequest(
        (event as CustomEvent<unknown>).detail,
      );
      const fittingState = useFittingStore.getState();
      const selectedModel = useFittingModelStore.getState().currentFittingModel;

      if (
        !isMobileTouchEnvironment ||
        !request ||
        inFlightRef.current ||
        fittingState.isImageProcessing ||
        fittingState.capturedClothingImage ||
        fittingState.fittingJobId ||
        selectedModel.defaultModelId <= 0 ||
        !selectedModel.defaultModelUrl
      ) {
        return;
      }

      const pluginState = usePluginStore.getState();
      if (!pluginState.isPluginOpen) {
        pluginState.setIsPluginOpen(true);
        trackProductEvent('plugin_opened', {
          host_page_url: getHostPageUrl(),
        });
      }

      if (IS_VIRTUAL_FITTING_API_DISABLED) {
        toast.success(getVirtualFittingApiDisabledMessage());
        dispatchBridgeState(true, false);
        return;
      }

      const debugTraceId = request.requestId;
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      inFlightRef.current = true;
      setIsPreparing(true);
      fittingState.setIsCapturing(false);
      fittingState.setIsFittingDialogOpen(false);
      fittingState.setIsImageProcessing(true);
      fittingState.setProductPageUrl(null);

      const startTryOn = async () => {
        try {
          captureDebugInfo(debugTraceId, 'mobile_product_try_on.fetch_start');
          const clothingImage = await fetchMobileProductImageBlob(
            request.imageUrl,
            debugTraceId,
            abortController.signal,
          );
          setBlobDebugTraceId(clothingImage, debugTraceId);

          const latestModel =
            useFittingModelStore.getState().currentFittingModel;
          if (latestModel.defaultModelId <= 0 || !latestModel.defaultModelUrl) {
            throw new Error('No fitting model is available');
          }

          const hostPageUrl = getHostPageUrl();
          trackProductEvent('fitting_request_submitted', {
            fitting_request_id: debugTraceId,
            default_model_id: latestModel.defaultModelId,
            model_name: latestModel.modelName,
            captured_image_type: clothingImage.type || 'unknown',
            captured_image_size_bytes: clothingImage.size,
          });
          captureDebugInfo(debugTraceId, 'mobile_product_try_on.store_start', {
            blobSize: clothingImage.size,
            blobType: clothingImage.type,
          });

          const latestFittingState = useFittingStore.getState();
          latestFittingState.setProductPageUrl(hostPageUrl);
          latestFittingState.setCapturedClothingImage(clothingImage);
          latestFittingState.setFittingJobId(debugTraceId);
        } catch (error) {
          if (abortController.signal.aborted) {
            return;
          }
          captureDebugError(debugTraceId, 'mobile_product_try_on.failed', {
            error,
          });
          toast.error(copy.fitting.mobileImageFailed);
        } finally {
          if (abortControllerRef.current === abortController) {
            abortControllerRef.current = null;
          }
          inFlightRef.current = false;
          setIsPreparing(false);
          useFittingStore.getState().setIsImageProcessing(false);
        }
      };

      void startTryOn();
    };

    hostWindow.addEventListener(
      MOBILE_PRODUCT_TRY_ON_REQUEST_EVENT,
      handleProductTryOnRequest,
    );
    dispatchBridgeState(true, isBusy);

    return () => {
      hostWindow.removeEventListener(
        MOBILE_PRODUCT_TRY_ON_REQUEST_EVENT,
        handleProductTryOnRequest,
      );
    };
  }, [
    copy.fitting.mobileImageFailed,
    isBusy,
    isMobileTouchEnvironment,
    isModelReady,
    toast,
  ]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      dispatchBridgeState(false, false);
    };
  }, []);

  return null;
};
