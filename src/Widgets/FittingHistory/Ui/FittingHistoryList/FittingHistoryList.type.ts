export type CanScrollDirectionState = 'BOTH' | 'LEFT' | 'RIGHT' | 'NONE';
export type CanScrollDirectionAction = {
  type: 'SET_SCROLL_DIRECTION';
  payload: {
    scrollPosition: number;
    scrollWidth: number;
    scrollContainerWidth: number;
  };
};
