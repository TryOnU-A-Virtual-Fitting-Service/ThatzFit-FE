import { getUserToken, postUserInfo } from '@/Entities/User';

let initUserInfoPromise: Promise<void> | null = null;

export const initUserInfo = async () => {
  if (!initUserInfoPromise) {
    initUserInfoPromise = postUserInfo({
      uuid: getUserToken(),
    })
      .then(() => undefined)
      .catch((error) => {
        initUserInfoPromise = null;
        throw error;
      });
  }

  return initUserInfoPromise;
};
