import { BASE_URL } from '@/Shared/Config';
import { post } from '@/Shared/Model';

import {
  IS_VIRTUAL_FITTING_API_DISABLED,
  VIRTUAL_FITTING_API_DISABLED_MESSAGE,
} from '../Config';
import {
  captureDebugError,
  captureDebugInfo,
  summarizeUrl,
} from '../Model/debug';
import type {
  PostClothesImageDataUrlRequestDto,
  PostClothesImageDataUrlResponseDto,
  PostFittingJobResponseDto,
  PostFittingRequestDto,
  PostFittingResponseDto,
} from '../Type';
export const postFittingJob = async (debugTraceId?: string) => {
  if (IS_VIRTUAL_FITTING_API_DISABLED) {
    captureDebugInfo(debugTraceId, 'api.post_fitting_job.disabled');
    throw new Error(VIRTUAL_FITTING_API_DISABLED_MESSAGE);
  }

  captureDebugInfo(debugTraceId, 'api.post_fitting_job.request_start', {
    baseUrl: BASE_URL,
    path: '/api/v1/try-on/job',
  });
  try {
    const response =
      await post<PostFittingJobResponseDto>('/api/v1/try-on/job');
    const json = await response.json();
    captureDebugInfo(debugTraceId, 'api.post_fitting_job.request_success', {
      tryOnJobId: json.data.tryOnJobId,
    });
    return json;
  } catch (error) {
    captureDebugError(debugTraceId, 'api.post_fitting_job.request_failed', {
      error,
    });
    throw error;
  }
};

export const postFitting = async (dto: PostFittingRequestDto) => {
  const debugTraceId = dto.request.debugTraceId;

  if (IS_VIRTUAL_FITTING_API_DISABLED) {
    captureDebugInfo(debugTraceId, 'api.post_fitting.disabled', {
      tryOnJobId: dto.request.tryOnJobId,
      defaultModelId: dto.request.defaultModelId,
    });
    throw new Error(VIRTUAL_FITTING_API_DISABLED_MESSAGE);
  }

  const formData = new FormData();
  formData.append('file', dto.file);
  formData.append(
    'request',
    new Blob([JSON.stringify(dto.request)], {
      type: 'application/json',
    }),
  );

  captureDebugInfo(debugTraceId, 'api.post_fitting.request_start', {
    tryOnJobId: dto.request.tryOnJobId,
    defaultModelId: dto.request.defaultModelId,
    modelUrl: summarizeUrl(dto.request.modelUrl),
    productPageUrl: summarizeUrl(dto.request.productPageUrl),
    file: {
      name: dto.file.name,
      size: dto.file.size,
      type: dto.file.type,
    },
  });

  try {
    const response = await post<PostFittingResponseDto>(
      `/api/v1/try-on/fitting`,
      {
        headers: {
          'Content-Type': undefined,
        },
        body: formData,
      },
    );
    const json = await response.json();
    captureDebugInfo(debugTraceId, 'api.post_fitting.request_success', {
      tryOnJobId: json.data.tryOnJobId,
      defaultModelId: json.data.defaultModelId,
      tryOnResultUrl: summarizeUrl(json.data.tryOnResultUrl),
      modelName: json.data.modelName,
    });
    return json;
  } catch (error) {
    captureDebugError(debugTraceId, 'api.post_fitting.request_failed', {
      error,
    });
    throw error;
  }
};

export const postClothesImageDataUrl = async (
  dto: PostClothesImageDataUrlRequestDto,
) => {
  captureDebugInfo(undefined, 'api.post_image_data_url.request_start', {
    imageUrl: summarizeUrl(dto.imageUrl),
  });
  try {
    const response = await post<PostClothesImageDataUrlResponseDto>(
      `/api/v1/try-on/image`,
      {
        body: JSON.stringify(dto),
      },
    );
    const json = await response.json();
    captureDebugInfo(undefined, 'api.post_image_data_url.request_success', {
      dataUrlLength: json.data.dataUrl.length,
    });
    return json;
  } catch (error) {
    captureDebugError(undefined, 'api.post_image_data_url.request_failed', {
      error,
    });
    throw error;
  }
};
