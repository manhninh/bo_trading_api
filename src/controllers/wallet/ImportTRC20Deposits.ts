
import { importDeposits } from '@src/business/wallet/ImportDepositsBusiness';
export default async (): Promise<void> => {
  try {
    const result = await importDeposits();
  } catch (err) {
    console.log(`\nError when trying Import new Deposits: ${err}`);
  }
};
