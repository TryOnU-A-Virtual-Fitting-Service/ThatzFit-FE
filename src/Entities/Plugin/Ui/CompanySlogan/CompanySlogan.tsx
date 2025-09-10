interface CompanySloganProps {
  sloganUrl: string;
  className?: string;
}

export const CompanySlogan = ({ sloganUrl, className }: CompanySloganProps) => {
  return <img src={sloganUrl} className={className} />;
};
