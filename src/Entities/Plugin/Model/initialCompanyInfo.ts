import { getPluginSetup } from '@/Entities/Plugin/Api';
import { usePluginStore } from '@/Entities/Plugin/Model/usePluginStore';

export const initialCompanyInfo = async () => {
  const companyInfo = await getPluginSetup({ url: window.location.href });
  if (companyInfo) {
    const { logoUrl, sloganUrl, btnUrl } = companyInfo.data;
    usePluginStore.setState({
      companyLogoUrl: logoUrl,
      companySloganUrl: sloganUrl,
      pluginButtonImageUrl: btnUrl,
    });
  }
};
