type FittingModelImageProps = {
  src: string;
  imageFileName: string;
  className?: string;
};

export const FittingModelImage = ({
  src,
  imageFileName,
  className,
}: FittingModelImageProps) => {
  if (!src) {
    return null;
  }

  return <img src={src} alt={imageFileName} className={className} />;
};
