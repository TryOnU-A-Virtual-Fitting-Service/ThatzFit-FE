import { getUserToken, postUserInfo } from '@/Entities/User';

export const initUserInfo = () => {
  postUserInfo({
    uuid: getUserToken(),
  });
};
