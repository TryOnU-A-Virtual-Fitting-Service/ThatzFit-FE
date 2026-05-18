import { type KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { FittingHistoryListItem } from '@/Features/FittingHistory';

import { Button } from '@/Shared/Components';

import {
  CAN_SCROLL_DIRECTION,
  CAN_SCROLL_DIRECTION_TYPE,
} from './FittingHistoryList.constant';
import { FittingHistoryListLoading } from './FittingHistoryList.loading';
import { useFittingHistoryListScrollReducer } from './FittingHistoryList.reducer';
import type { CanScrollDirectionAction } from './FittingHistoryList.type';

type FittingHistoryListProps = {
  fittingHistoryList?: Schema.FittingHistory[];
  isLoading?: boolean;
  isSuccess?: boolean;
};

export const FittingHistoryList = ({
  fittingHistoryList,
  isLoading = false,
  isSuccess = false,
}: FittingHistoryListProps) => {
  const fittingHistoryListContainer = useRef<HTMLDivElement>(null);
  const { state: canScrollDirection, dispatch } =
    useFittingHistoryListScrollReducer();

  const calculateCanScrollDirection = useCallback(
    (args: CanScrollDirectionAction['payload']) => {
      dispatch({
        type: CAN_SCROLL_DIRECTION_TYPE.SET_SCROLL_DIRECTION,
        payload: {
          ...args,
        },
      });
    },
    [dispatch],
  );

  const updateCanScrollDirection = useCallback(() => {
    const scrollContainer = fittingHistoryListContainer.current;
    if (!scrollContainer) {
      return;
    }

    calculateCanScrollDirection({
      scrollPosition: scrollContainer.scrollLeft,
      scrollWidth: scrollContainer.scrollWidth,
      scrollContainerWidth: scrollContainer.clientWidth,
    });
  }, [calculateCanScrollDirection]);

  const scrollHistoryList = useCallback(
    (direction: -1 | 1) => {
      const scrollContainer = fittingHistoryListContainer.current;
      if (!scrollContainer) {
        return;
      }

      scrollContainer.scrollBy({
        left: direction * Math.max(scrollContainer.clientWidth - 48, 48),
        behavior: 'smooth',
      });
      requestAnimationFrame(updateCanScrollDirection);
    },
    [updateCanScrollDirection],
  );

  useEffect(() => {
    const scrollContainer = fittingHistoryListContainer.current;
    if (!scrollContainer) {
      return;
    }

    updateCanScrollDirection();

    const handleVerticalScroll = (event: WheelEvent) => {
      if (scrollContainer.scrollWidth <= scrollContainer.clientWidth) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY || event.detail;
      scrollContainer.scrollLeft += delta;
      updateCanScrollDirection();
    };

    scrollContainer.addEventListener('wheel', handleVerticalScroll, {
      passive: false,
    });

    return () => {
      scrollContainer.removeEventListener('wheel', handleVerticalScroll);
    };
  }, [
    fittingHistoryList?.length,
    isLoading,
    isSuccess,
    updateCanScrollDirection,
  ]);

  const handleArrowKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown': {
        event.preventDefault();
        event.stopPropagation();
        scrollHistoryList(-1);
        break;
      }
      case 'ArrowRight':
      case 'ArrowUp': {
        event.preventDefault();
        event.stopPropagation();
        scrollHistoryList(1);
        break;
      }
      default:
        return;
    }
  };

  const { LEFT, RIGHT, BOTH } = CAN_SCROLL_DIRECTION;

  const hasLeftScroll =
    canScrollDirection === LEFT || canScrollDirection === BOTH;
  const hasRightScroll =
    canScrollDirection === RIGHT || canScrollDirection === BOTH;

  if (!fittingHistoryList) {
    return null;
  }

  return (
    <div className='relative mt-2'>
      <div
        className='bg-grey-08 scrollbar-hide flex h-[3.625rem] w-full items-center gap-2 overflow-x-auto rounded-md p-2'
        ref={fittingHistoryListContainer}
        tabIndex={0}
        onKeyDown={handleArrowKeyDown}
        onScroll={updateCanScrollDirection}
      >
        {isLoading ? (
          <FittingHistoryListLoading />
        ) : (
          fittingHistoryList.map((tryOnResult) => (
            <FittingHistoryListItem
              key={tryOnResult.tryOnJobId}
              fittingHistory={tryOnResult}
            />
          ))
        )}
      </div>
      {hasLeftScroll && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='bg-grey-08/90 text-grey-03 absolute top-1/2 left-1 z-10 h-8 w-6 -translate-y-1/2 rounded-md p-0 shadow-sm hover:bg-white'
          aria-label='Previous fitting history'
          onClick={() => scrollHistoryList(-1)}
        >
          <ChevronLeft size={14} />
        </Button>
      )}
      {hasRightScroll && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='bg-grey-08/90 text-grey-03 absolute top-1/2 right-1 z-10 h-8 w-6 -translate-y-1/2 rounded-md p-0 shadow-sm hover:bg-white'
          aria-label='Next fitting history'
          onClick={() => scrollHistoryList(1)}
        >
          <ChevronRight size={14} />
        </Button>
      )}
    </div>
  );
};
