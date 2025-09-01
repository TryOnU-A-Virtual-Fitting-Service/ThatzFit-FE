import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  FittingModelDeleteButton,
  FittingModelDragHandler,
  FittingModelNameInput,
} from '@/Features/FittingModel';

import { useFittingModelStore } from '@/Entities/FittingModel';

type FittingModelEditListItemProps = {
  fittingModel: Schema.FittingModel;
  handleUpdateModelName: (
    targetModelId: Schema.FittingModel['defaultModelId'],
    modelName: string,
  ) => void;
  handleFittingModelDelete: (targetId: number) => void;
};

export const FittingModelEditListItem = ({
  fittingModel,
  handleUpdateModelName,
  handleFittingModelDelete,
}: FittingModelEditListItemProps) => {
  const {
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({ id: fittingModel.defaultModelId });

  const selectedModelUrl = useFittingModelStore(
    (state) => state.currentFittingModel.modelUrl,
  );

  const handleChangeModelName = (modelName: string) => {
    handleUpdateModelName(fittingModel.defaultModelId, modelName);
  };

  const isDefaultModel = !fittingModel.isCustom;
  const isSelectedModel = selectedModelUrl === fittingModel.defaultModelUrl;

  return (
    <div
      key={fittingModel.defaultModelId}
      className='flex h-7 w-full items-center gap-1 select-none'
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? '100' : undefined,
      }}
    >
      <FittingModelDragHandler
        setActivatorNodeRef={setActivatorNodeRef}
        listeners={listeners}
      />
      <FittingModelNameInput
        modelId={fittingModel.defaultModelId}
        editableModelName={fittingModel.modelName}
        updateModelName={handleChangeModelName}
        disabled={isDefaultModel}
      />
      <FittingModelDeleteButton
        deleteTargetModelId={fittingModel.defaultModelId}
        disabled={isDefaultModel || isSelectedModel}
        handleFittingModelDelete={handleFittingModelDelete}
      />
    </div>
  );
};
