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
  return <img src={src} alt={imageFileName} className={className} />;
};
