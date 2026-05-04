export type VirtualFittingReadinessReason = 'paused' | 'provider_not_ready';

export type VirtualFittingReadinessResponseDto = {
  ready: boolean;
  paused: boolean;
  provider: string;
  reason: VirtualFittingReadinessReason | null;
  message: string;
};
