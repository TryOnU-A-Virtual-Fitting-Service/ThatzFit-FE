interface CompanySloganProps {
  sloganUrl: string;
  slogan: string;
  className?: string;
}

export const CompanySlogan = ({
  sloganUrl,
  slogan,
  className,
}: CompanySloganProps) => {
  return <img src={sloganUrl} alt={slogan} className={className} />;
};
