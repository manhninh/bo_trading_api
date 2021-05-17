import ProtectLogRepository from '@src/repository/ProtectLogRepository';
import {IProtectLogModel} from 'bo-trading-common/lib/models/protectLogs';

export const GetProtectHistoryBusiness = async (): Promise<IProtectLogModel[]> => {
  try {
    const protectLogRes = new ProtectLogRepository();
    const logs = await protectLogRes.limitTopNewProtect();
    return logs;
  } catch (err) {
    throw err;
  }
};
