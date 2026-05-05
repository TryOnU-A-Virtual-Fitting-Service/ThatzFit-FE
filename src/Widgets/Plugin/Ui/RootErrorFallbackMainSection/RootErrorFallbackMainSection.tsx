import { PluginReloadButton } from '@/Features/Plugin';

import { getPluginCopy } from '@/Shared/Config';

export const RootErrorFallbackMainSection = () => {
  const copy = getPluginCopy();

  return (
    <section className='flex h-full w-full flex-col px-3.5'>
      <div className='text-body1-medium text-grey-05 flex grow items-center justify-center'>
        <span className='text-center'>
          {copy.plugin.errorLine1} <br />
          {copy.plugin.errorLine2}
        </span>
      </div>
      <PluginReloadButton />
    </section>
  );
};
