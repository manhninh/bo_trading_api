
import { importTRC20DepositsSystem } from '@src/business/wallet/ImportTRC20DepositsSystemBusiness';
export default async (): Promise<void> => {
  try {
    const result = await importTRC20DepositsSystem();
  } catch (err) {
    console.log(`\nError when trying Import new Deposits: ${err}`);
  }
};
