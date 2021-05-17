
import { importERC20Deposits } from '@src/business/wallet/ImportERC20DepositsBusiness';
export default async (): Promise<void> => {
  try {
    const result = await importERC20Deposits();
  } catch (err) {
    console.log(`\nError when trying Import new ERC20 Deposits: ${err}`);
  }
};
