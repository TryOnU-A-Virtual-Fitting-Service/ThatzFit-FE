interface CompanyLogoProps {
  logoUrl: string;
  className?: string;
}

export const CompanyLogo = ({ logoUrl, className }: CompanyLogoProps) => {
  if (!logoUrl) {
    return null;
  }

  return <img src={logoUrl} alt='회사 로고' className={className} />;
};
