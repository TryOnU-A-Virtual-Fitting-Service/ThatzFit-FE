import { getPluginCopy } from '@/Shared/Config';

interface CompanyLogoProps {
  logoUrl: string;
  className?: string;
}

export const CompanyLogo = ({ logoUrl, className }: CompanyLogoProps) => {
  const copy = getPluginCopy();

  if (!logoUrl) {
    return null;
  }

  return (
    <img src={logoUrl} alt={copy.plugin.companyLogoAlt} className={className} />
  );
};
