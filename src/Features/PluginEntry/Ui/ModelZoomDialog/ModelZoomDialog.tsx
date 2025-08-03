import { Maximize2, Minimize2 } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Shared/Components';

export const ModelZoomDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-[0.3125rem]'>
          <Maximize2 />
        </Button>
      </DialogTrigger>
      <DialogContent className='z-[10000000]' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Model Zoom</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button size='icon'>
              <Minimize2 />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
