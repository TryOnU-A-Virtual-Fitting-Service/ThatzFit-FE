import { type KeyboardEvent, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { FittingHistoryListItem } from '@/Features/FittingHistory';

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

  // NOTE: useCallback 대신 ref 활용
  const calculateCanScrollDirection = useRef(
    (args: CanScrollDirectionAction['payload']) => {
      dispatch({
        type: CAN_SCROLL_DIRECTION_TYPE.SET_SCROLL_DIRECTION,
        payload: {
          ...args,
        },
      });
    },
  );

  useEffect(() => {
    const scrollContainer = fittingHistoryListContainer.current;
    if (!scrollContainer) {
      return;
    }

    const handleVerticalScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const delta = event.deltaY || event.detail;
      scrollContainer.scrollLeft += delta;
      calculateCanScrollDirection.current({
        scrollPosition: scrollContainer.scrollLeft,
        scrollWidth: scrollContainer.scrollWidth,
        scrollContainerWidth: scrollContainer.clientWidth,
      });
    };

    scrollContainer.addEventListener('wheel', handleVerticalScroll, {
      passive: false,
    });

    return () => {
      scrollContainer.removeEventListener('wheel', handleVerticalScroll);
    };
  }, [isSuccess]);

  const handleArrowKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown': {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.scrollLeft -= 16;
        calculateCanScrollDirection.current({
          scrollPosition: event.currentTarget.scrollLeft,
          scrollWidth: event.currentTarget.scrollWidth,
          scrollContainerWidth: event.currentTarget.clientWidth,
        });
        break;
      }
      case 'ArrowRight':
      case 'ArrowUp': {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.scrollLeft += 16;
        calculateCanScrollDirection.current({
          scrollPosition: event.currentTarget.scrollLeft,
          scrollWidth: event.currentTarget.scrollWidth,
          scrollContainerWidth: event.currentTarget.clientWidth,
        });
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
    <div
      className='bg-grey-08 scrollbar-hide !relative mt-2 flex h-[3.625rem] w-full items-center gap-2 overflow-x-auto rounded-md p-2'
      ref={fittingHistoryListContainer}
      onKeyDown={handleArrowKeyDown}
    >
      {isLoading ? (
        <FittingHistoryListLoading />
      ) : (
        <>
          {hasLeftScroll && (
            <ChevronLeft className='text-grey-03 fixed left-4 z-10' size={12} />
          )}
          {fittingHistoryList.map((tryOnResult) => (
            <FittingHistoryListItem
              key={tryOnResult.tryOnJobId}
              fittingHistory={tryOnResult}
            />
          ))}
          {hasRightScroll && (
            <ChevronRight
              className='text-grey-03 fixed right-4 z-10'
              size={12}
            />
          )}
        </>
      )}
    </div>
  );
};
