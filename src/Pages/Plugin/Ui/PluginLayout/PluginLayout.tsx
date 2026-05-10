import type { PropsWithChildren } from 'react';

const PluginHeader = ({ children }: PropsWithChildren) => {
  return <header className='h-full min-h-0 overflow-hidden'>{children}</header>;
};

const PluginMain = ({ children }: PropsWithChildren) => {
  return (
    <main className='h-full min-h-0 min-w-0 overflow-hidden'>{children}</main>
  );
};

const PluginFooter = ({ children }: PropsWithChildren) => {
  return <footer className='h-full min-h-0 overflow-hidden'>{children}</footer>;
};

export const PluginLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='grid h-full min-h-0 grid-rows-[4.875rem_minmax(0,1fr)_2rem] overflow-hidden'>
      {children}
    </div>
  );
};

PluginLayout.Header = PluginHeader;
PluginLayout.Main = PluginMain;
PluginLayout.Footer = PluginFooter;
