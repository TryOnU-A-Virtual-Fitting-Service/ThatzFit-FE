import { useReducer } from 'react';

import {
  CAN_SCROLL_DIRECTION,
  CAN_SCROLL_DIRECTION_TYPE,
} from './FittingHistoryList.constant';
import type {
  CanScrollDirectionAction,
  CanScrollDirectionState,
} from './FittingHistoryList.type';

export const useFittingHistoryListScrollReducer = () => {
  const reducer = (
    state: CanScrollDirectionState,
    action: CanScrollDirectionAction,
  ) => {
    switch (action.type) {
      case CAN_SCROLL_DIRECTION_TYPE.SET_SCROLL_DIRECTION: {
        const { scrollPosition, scrollWidth, scrollContainerWidth } =
          action.payload;
        if (scrollPosition === 0) {
          if (scrollWidth === scrollContainerWidth) {
            return CAN_SCROLL_DIRECTION.NONE;
          } else {
            return CAN_SCROLL_DIRECTION.RIGHT;
          }
        } else {
          if (scrollPosition >= scrollWidth - scrollContainerWidth) {
            return CAN_SCROLL_DIRECTION.LEFT;
          } else {
            return CAN_SCROLL_DIRECTION.BOTH;
          }
        }
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, 'NONE');

  return { state, dispatch };
};
