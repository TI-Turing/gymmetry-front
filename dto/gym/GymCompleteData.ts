import { GymStep1Data } from './GymStep1Data';
import { GymStep2Data } from './GymStep2Data';
import { GymStep3Data } from './GymStep3Data';
import { GymStep4Data } from './GymStep4Data';
import { GymStep5Data } from './GymStep5Data';

export interface GymCompleteData
  extends GymStep1Data,
    GymStep2Data,
    GymStep3Data,
    GymStep4Data,
    GymStep5Data {
  Id: string;
}
