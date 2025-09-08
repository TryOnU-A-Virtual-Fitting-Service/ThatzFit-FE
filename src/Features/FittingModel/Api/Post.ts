import { post } from '@/Shared/Model';

import type {
  PostFittingModelRequestDto,
  PostFittingModelResponseDto,
} from '../Type';

export const postFittingModel = async (dto: PostFittingModelRequestDto) => {
  const formData = new FormData();
  formData.append('file', dto.file);

  return post<PostFittingModelResponseDto>(`/api/default-model`, {
    headers: {
      'Content-Type': undefined,
    },
    body: formData,
  }).then((res) => res.json());
};
