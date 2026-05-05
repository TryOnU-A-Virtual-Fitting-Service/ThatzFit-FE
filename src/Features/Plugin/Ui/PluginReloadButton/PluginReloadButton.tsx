import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';

export const PluginReloadButton = () => {
  const copy = getPluginCopy();

  const handleClickReloadButton = () => {
    window.location.reload();
  };

  return (
    <Button
      className='bg-grey-02 cursor-pointer hover:bg-black'
      onClick={handleClickReloadButton}
    >
      {copy.plugin.reload}
    </Button>
  );
};
