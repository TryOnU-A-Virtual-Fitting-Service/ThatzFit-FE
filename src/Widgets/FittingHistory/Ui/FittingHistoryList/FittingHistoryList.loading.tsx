import { FittingHistoryListItemLoading } from '@/Features/FittingHistory';

export const FittingHistoryListLoading = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <FittingHistoryListItemLoading key={index} />
  ));
};
