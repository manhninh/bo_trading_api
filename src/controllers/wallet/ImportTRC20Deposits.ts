
import { importTRC20Deposits } from '@src/business/wallet/ImportTRC20DepositsBusiness';
export default async (): Promise<void> => {
  try {
    const result = await importTRC20Deposits();
  } catch (err) {
    console.log(`\nError when trying Import new TRC20 Deposits: ${err}`);
  }
};
