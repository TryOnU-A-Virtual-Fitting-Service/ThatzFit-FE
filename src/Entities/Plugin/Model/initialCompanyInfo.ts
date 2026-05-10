import { getPluginSetup } from '@/Entities/Plugin/Api';
import { usePluginStore } from '@/Entities/Plugin/Model/usePluginStore';

import { getHostPageUrl } from '@/Shared/Lib';

export const initialCompanyInfo = async () => {
  const companyInfo = await getPluginSetup({ url: getHostPageUrl() });
  if (companyInfo) {
    const { logoUrl, sloganUrl, btnUrl } = companyInfo.data;
    usePluginStore.setState({
      companyLogoUrl: logoUrl,
      companySloganUrl: sloganUrl,
      pluginButtonImageUrl: btnUrl,
    });
  }
};
