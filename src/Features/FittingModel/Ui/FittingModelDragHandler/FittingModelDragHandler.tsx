import { useSortable } from '@dnd-kit/sortable';
import { AlignJustify } from 'lucide-react';

interface FittingModelDragHandlerProps {
  setActivatorNodeRef: ReturnType<typeof useSortable>['setActivatorNodeRef'];
  listeners: ReturnType<typeof useSortable>['listeners'];
}

export const FittingModelDragHandler = ({
  setActivatorNodeRef,
  listeners,
}: FittingModelDragHandlerProps) => {
  return (
    <span
      className='text-grey-04 shrink-0 cursor-grab'
      ref={setActivatorNodeRef}
      {...listeners}
    >
      <AlignJustify size={12} />
    </span>
  );
};
