import { trackProductEvent } from '@/Shared/Analytics';
import { Button } from '@/Shared/Components';
import { getLocale, getPluginCopy } from '@/Shared/Config';

const THATZFIT_LANDING_BASE_URL = 'https://thatzfit.me';

export const ThatzfitLandingButton = () => {
  const copy = getPluginCopy();
  const landingUrl = `${THATZFIT_LANDING_BASE_URL}/${getLocale()}`;

  return (
    <Button
      asChild
      variant='ghost'
      className='text-grey-04 hover:bg-grey-09 hover:text-grey-01 mt-1 h-[0.9375rem] rounded-sm bg-white px-1 py-1.5 select-none'
    >
      <a
        href={landingUrl}
        target='_top'
        rel='noreferrer'
        onClick={() =>
          trackProductEvent('powered_by_clicked', {
            destination_url: landingUrl,
          })
        }
      >
        <span className='text-grey-04 hover:text-grey-01 text-body3'>
          {copy.plugin.poweredBy}
        </span>
      </a>
    </Button>
  );
};
