interface CompanySloganProps {
  sloganUrl: string;
  className?: string;
}

export const CompanySlogan = ({ sloganUrl, className }: CompanySloganProps) => {
  return <img src={sloganUrl} alt='회사 슬로건' className={className} />;
};
