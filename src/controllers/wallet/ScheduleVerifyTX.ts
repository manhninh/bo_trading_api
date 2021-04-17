
import { ScheduleVerifyTX } from '@src/business/wallet/ScheduleVerifyTXBusiness';
export default async (): Promise<void> => {
  try {
    const result = await ScheduleVerifyTX();
  } catch (err) {
    console.log(`\nError when trying Import new Deposits: ${err}`);
  }
};
