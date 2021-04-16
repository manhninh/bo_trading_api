
import { importDepositsSystem } from '@src/business/wallet/ImportDepositsSystemBusiness';
export default async (): Promise<void> => {
  try {
    const result = await importDepositsSystem();
  } catch (err) {
    console.log(`\nError when trying Import new Deposits: ${err}`);
  }
};
