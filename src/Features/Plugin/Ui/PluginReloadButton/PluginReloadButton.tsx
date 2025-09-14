import { Button } from '@/Shared/Components';

export const PluginReloadButton = () => {
  const handleClickReloadButton = () => {
    window.location.reload();
  };

  return (
    <Button
      className='bg-grey-02 cursor-pointer hover:bg-black'
      onClick={handleClickReloadButton}
    >
      새로고침
    </Button>
  );
};
