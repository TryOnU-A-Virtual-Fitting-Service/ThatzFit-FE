interface CompanyLogoProps {
  logoUrl: string;
  companyName: string;
  className?: string;
}

export const CompanyLogo = ({
  logoUrl,
  companyName,
  className,
}: CompanyLogoProps) => {
  return <img src={logoUrl} alt={companyName} className={className} />;
};
