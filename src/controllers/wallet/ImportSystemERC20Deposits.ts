
import { importERC20DepositsSystem } from '@src/business/wallet/ImportERC20DepositsSystemBusiness';
export default async (): Promise<void> => {
  try {
    const result = await importERC20DepositsSystem();
  } catch (err) {
    console.log(`\nError when trying Import new Deposits: ${err}`);
  }
};
