import { PluginReloadButton } from '@/Features/Plugin';

export const RootErrorFallbackMainSection = () => {
  return (
    <section className='flex h-full w-full flex-col px-3.5'>
      <div className='text-body1-medium text-grey-05 flex grow items-center justify-center'>
        <span className='text-center'>
          일시적인 오류가 발생했어요. <br />
          잠시 후 다시 시도해 주세요.
        </span>
      </div>
      <PluginReloadButton />
    </section>
  );
};
