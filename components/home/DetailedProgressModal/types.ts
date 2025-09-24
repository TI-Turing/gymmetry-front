export type ProgressStatus = 'success' | 'fail' | 'rest';

export interface ProgressDaySquareProps {
  dayNumber: number;
  percentage: number;
  status: ProgressStatus;
}

export interface DetailedProgressViewProps {
  progressData: ProgressDaySquareProps[];
}

export interface DetailedProgressModalProps {
  visible: boolean;
  onClose: () => void;
  progressData: ProgressDaySquareProps[];
  hasActivePlan: boolean;
}
