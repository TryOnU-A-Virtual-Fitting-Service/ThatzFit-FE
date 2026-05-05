import { getPluginCopy } from '@/Shared/Config';

interface CompanySloganProps {
  sloganUrl: string;
  className?: string;
}

export const CompanySlogan = ({ sloganUrl, className }: CompanySloganProps) => {
  const copy = getPluginCopy();

  if (!sloganUrl) {
    return null;
  }

  return (
    <img
      src={sloganUrl}
      alt={copy.plugin.companySloganAlt}
      className={className}
    />
  );
};
