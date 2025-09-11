interface CompanyLogoProps {
  logoUrl: string;
  className?: string;
}

export const CompanyLogo = ({ logoUrl, className }: CompanyLogoProps) => {
  return <img src={logoUrl} alt='회사 로고' className={className} />;
};
