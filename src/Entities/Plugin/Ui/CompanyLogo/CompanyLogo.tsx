interface CompanyLogoProps {
  logoUrl: string;
  className?: string;
}

export const CompanyLogo = ({ logoUrl, className }: CompanyLogoProps) => {
  return <img src={logoUrl} className={className} />;
};
