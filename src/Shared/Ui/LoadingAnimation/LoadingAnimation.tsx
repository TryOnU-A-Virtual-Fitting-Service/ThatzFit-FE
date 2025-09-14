import { useEffect, useState } from 'react';

import { LOADING_ANIMATION_IMAGE_LIST } from './LoadingAnimation.constant';

export const LoadingAnimation = () => {
  const [imageIndex, setImageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % LOADING_ANIMATION_IMAGE_LIST.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadingImage = LOADING_ANIMATION_IMAGE_LIST[imageIndex];

  if (!loadingImage) {
    return <div className='h-5 w-5'></div>;
  }

  return (
    <img
      src={`${import.meta.env.VITE_CDN_HOST}/default/assets/animation/${loadingImage}.svg`}
      alt='loading animation'
      className='h-5 w-5'
    />
  );
};
