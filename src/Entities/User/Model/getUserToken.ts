import { nanoid } from 'nanoid';

import { USER_TOKEN_KEY } from '@/Shared/Config';
import { parentLocalStorage } from '@/Shared/Model';

export const getUserToken = () => {
  let token = parentLocalStorage.getItem(USER_TOKEN_KEY);
  if (!token) {
    token = nanoid();
    parentLocalStorage.setItem(USER_TOKEN_KEY, token);
  }
  return token;
};
