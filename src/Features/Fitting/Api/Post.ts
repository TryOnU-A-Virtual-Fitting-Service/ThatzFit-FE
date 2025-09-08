import { post } from '@/Shared/Model';

import type {
  PostClothesImageDataUrlRequestDto,
  PostClothesImageDataUrlResponseDto,
  PostFittingJobResponseDto,
  PostFittingRequestDto,
  PostFittingResponseDto,
} from '../Type';
export const postFittingJob = async () => {
  return post<PostFittingJobResponseDto>('/api/try-on/job').then((res) =>
    res.json(),
  );
};

export const postFitting = async (dto: PostFittingRequestDto) => {
  const formData = new FormData();
  formData.append('file', dto.file);
  formData.append(
    'request',
    new Blob([JSON.stringify(dto.request)], {
      type: 'application/json',
    }),
  );

  return post<PostFittingResponseDto>(`/api/try-on/fitting`, {
    headers: undefined,
    body: formData,
  }).then((res) => res.json());
};

export const postClothesImageDataUrl = async (
  dto: PostClothesImageDataUrlRequestDto,
) => {
  return post<PostClothesImageDataUrlResponseDto>(`/api/try-on/image`, {
    body: JSON.stringify(dto),
  }).then((res) => res.json());
};
