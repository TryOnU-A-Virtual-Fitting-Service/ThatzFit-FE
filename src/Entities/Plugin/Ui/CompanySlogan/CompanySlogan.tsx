interface CompanySloganProps {
  sloganUrl: string;
  className?: string;
}

export const CompanySlogan = ({ sloganUrl, className }: CompanySloganProps) => {
  if (!sloganUrl) {
    return null;
  }

  return <img src={sloganUrl} alt='회사 슬로건' className={className} />;
};
