import type { PropsWithChildren } from 'react';

const PluginHeader = ({ children }: PropsWithChildren) => {
  return <header className='h-full'>{children}</header>;
};

const PluginMain = ({ children }: PropsWithChildren) => {
  return <main className='h-full'>{children}</main>;
};

const PluginFooter = ({ children }: PropsWithChildren) => {
  return <footer className='h-full'>{children}</footer>;
};

export const PluginLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='grid h-full grid-rows-[5.875rem_1fr_2.25rem]'>
      {children}
    </div>
  );
};

PluginLayout.Header = PluginHeader;
PluginLayout.Main = PluginMain;
PluginLayout.Footer = PluginFooter;
