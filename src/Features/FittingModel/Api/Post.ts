import { post } from '@/Shared/Model';

import type { PostFittingModelRequestDto } from '../Type';

export const postFittingModel = async (dto: PostFittingModelRequestDto) => {
  const formData = new FormData();
  formData.append('file', dto.file);

  await post('/api/default-model', {
    body: formData,
    headers: {
      'Content-Type': undefined,
    },
  });
};
