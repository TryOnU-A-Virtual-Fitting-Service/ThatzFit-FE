import { getUserToken } from '@/Entities/User';

import { USER_TOKEN_KEY } from '@/Shared/Config';
import type { SuccessResponse } from '@/Shared/Type';

import type {
  PostFittingModelRequestDto,
  PostFittingModelResponseDto,
} from '../Type';

export const postFittingModel = async ({
  dto,
  updateUploadProgress,
}: {
  dto: PostFittingModelRequestDto;
  updateUploadProgress?: (uploadProgress: number) => void;
}): Promise<SuccessResponse<PostFittingModelResponseDto>> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', dto.file);

    // NOTE: upload progress 확인을 위해 xhr 사용
    const xhr = new XMLHttpRequest();
    let uploadProgress = 0;

    const handleUploadProgress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        uploadProgress = (event.loaded / event.total) * 100;
        updateUploadProgress?.(Math.floor(uploadProgress));
      }
    };

    xhr.upload.addEventListener('progress', handleUploadProgress);

    xhr.open('POST', '/api/default-model', true);
    xhr.setRequestHeader(USER_TOKEN_KEY, getUserToken());
    xhr.send(formData);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 300) {
        const result = JSON.parse(
          xhr.response,
        ) as SuccessResponse<PostFittingModelResponseDto>;
        resolve(result);
      } else {
        reject(new Error(`${xhr.status} : ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Failed to upload file'));
    };

    xhr.onabort = () => {
      reject(new Error('Upload aborted'));
    };
  });
};
