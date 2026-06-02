import { useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';

import {
  type DeleteFittingModel,
  FITTING_MODEL_ACTION_MODE,
  type FittingModelActionMode,
  FittingModelEditCancelButton,
  FittingModelEditConfirmButton,
  type UpdateFittingModel,
  usePatchFittingModelList,
} from '@/Features/FittingModel';

import {
  FITTING_MODEL_UPDATE_STATUS,
  fittingModelKeys,
  type GetFittingModelListResponseDto,
} from '@/Entities/FittingModel';

import { trackProductEvent } from '@/Shared/Analytics';
import { DialogTitle } from '@/Shared/Components';
import { getPluginCopy, isCustomError } from '@/Shared/Config';
import { useToast } from '@/Shared/Model';

import { FittingModelEditListItem } from '../FittingModelEditListItem';

type FittingModelEditListProps = {
  fittingModelList: GetFittingModelListResponseDto;
  setModelActionMode: (modelActionMode: FittingModelActionMode) => void;
};

export const FittingModelEditList = ({
  fittingModelList,
  setModelActionMode,
}: FittingModelEditListProps) => {
  const copy = getPluginCopy();
  const queryClient = useQueryClient();
  const { mutate: patchFittingModelList } = usePatchFittingModelList();

  // 수정 되는 모델 리스트
  const [fittingModelEditList, setFittingModelEditList] =
    useState<GetFittingModelListResponseDto>(fittingModelList);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const { toast } = useToast();

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ over }: DragEndEvent) => {
    if (over && activeId) {
      const activeIndex = fittingModelEditList.findIndex(
        (fittingModel) => fittingModel.defaultModelId === activeId,
      );
      const overIndex = fittingModelEditList.findIndex(
        (fittingModel) => fittingModel.defaultModelId === over.id,
      );
      setFittingModelEditList(
        arrayMove(fittingModelEditList, activeIndex, overIndex),
      );
    }
    setActiveId(null);
  };

  const handleUpdateModelName = (
    targetModelId: Schema.FittingModel['defaultModelId'],
    modelName: string,
  ) => {
    setFittingModelEditList(
      fittingModelEditList.map((fittingModel) => {
        if (fittingModel.defaultModelId === targetModelId) {
          return {
            ...fittingModel,
            modelName,
          };
        }
        return fittingModel;
      }),
    );
  };

  const handleFittingModelDelete = (targetId: number) => {
    setFittingModelEditList(
      fittingModelEditList.filter(
        (fittingModel) => fittingModel.defaultModelId !== targetId,
      ),
    );
  };

  const handleFittingModelListEdit = () => {
    const editedFittingModelList: UpdateFittingModel[] = fittingModelEditList
      .map((currentFittingModel, idx) => {
        const prevFittingModelInfo = fittingModelList.find(
          (model) =>
            model.defaultModelId === currentFittingModel.defaultModelId,
        );

        if (!prevFittingModelInfo) {
          return null;
        }

        const currentModelName = currentFittingModel.modelName;
        const currentSortOrder = idx + 1;

        const prevModelName = prevFittingModelInfo.modelName;
        // dnd로 순서가 변경되기 전의 위치 정보
        const prevSortOrder = currentFittingModel.sortOrder;

        if (
          currentModelName !== prevModelName &&
          currentSortOrder !== prevSortOrder
        ) {
          return {
            id: currentFittingModel.defaultModelId,
            modelName: currentModelName,
            sortOrder: currentSortOrder,
            status: FITTING_MODEL_UPDATE_STATUS.UPDATE,
          };
        }

        if (currentModelName !== prevModelName) {
          return {
            id: currentFittingModel.defaultModelId,
            modelName: currentModelName,
            sortOrder: prevSortOrder,
            status: FITTING_MODEL_UPDATE_STATUS.UPDATE,
          };
        }

        if (currentSortOrder !== prevSortOrder) {
          return {
            id: currentFittingModel.defaultModelId,
            modelName: currentModelName,
            sortOrder: currentSortOrder,
            status: FITTING_MODEL_UPDATE_STATUS.UPDATE,
          };
        }

        return null;
      })
      .filter((fittingModel) => !!fittingModel);

    const deletedFittingModelList: DeleteFittingModel[] = fittingModelList
      .filter(
        (fittingModel) =>
          !fittingModelEditList.find(
            (editedFittingModel) =>
              editedFittingModel.defaultModelId === fittingModel.defaultModelId,
          ),
      )
      .map((fittingModel) => ({
        id: fittingModel.defaultModelId,
        status: FITTING_MODEL_UPDATE_STATUS.DELETE,
      }));

    patchFittingModelList(
      {
        defaultModels: [...editedFittingModelList, ...deletedFittingModelList],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: fittingModelKeys.all,
          });
          trackProductEvent('fitting_model_list_updated', {
            updated_model_count: editedFittingModelList.length,
            deleted_model_count: deletedFittingModelList.length,
          });
          setModelActionMode(FITTING_MODEL_ACTION_MODE.SELECT);
        },
        onError: (error) => {
          if (isCustomError(error)) {
            toast.error(error.message);
          }
        },
      },
    );
  };

  const handleFittingModelListEditCancel = () => {
    setModelActionMode(FITTING_MODEL_ACTION_MODE.SELECT);
  };

  return (
    <>
      <DialogTitle className='text-center select-none'>
        {copy.model.editTitle}
      </DialogTitle>
      <div className='flex flex-col gap-3.5'>
        <div className='flex flex-col gap-2'>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext
              items={fittingModelEditList.map(
                (fittingModel) => fittingModel.defaultModelId,
              )}
            >
              {fittingModelEditList.map((fittingModel) => (
                <FittingModelEditListItem
                  key={fittingModel.defaultModelId}
                  fittingModel={fittingModel}
                  handleUpdateModelName={handleUpdateModelName}
                  handleFittingModelDelete={handleFittingModelDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className='flex gap-1 select-none'>
            <FittingModelEditCancelButton
              onClick={handleFittingModelListEditCancel}
            />
            <FittingModelEditConfirmButton
              onClick={handleFittingModelListEdit}
            />
          </div>
        </div>
      </div>
    </>
  );
};
