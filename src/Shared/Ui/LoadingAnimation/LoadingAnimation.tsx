import { useEffect, useState } from 'react';

import { LOADING_ANIMATION_IMAGE_LIST } from './LoadingAnimation.constant';

const loadingAnimationImages = LOADING_ANIMATION_IMAGE_LIST.filter(Boolean);

export const LoadingAnimation = () => {
  const [imageIndex, setImageIndex] = useState<number>(0);

  useEffect(() => {
    if (loadingAnimationImages.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % loadingAnimationImages.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadingImage = loadingAnimationImages[imageIndex];

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
