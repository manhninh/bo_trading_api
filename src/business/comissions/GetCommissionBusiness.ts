import CommissionRepository from '@src/repository/CommissionRepository';
import { ICommissionModel } from 'bo-trading-common/lib/models/commissions';

export const GetCommissionBusiness = async (userId: string): Promise<ICommissionModel[]> => {
  try {
    const commissionRes = new CommissionRepository();
    const commissions = await commissionRes.getCommissionByUserId(userId);
    return commissions;
  } catch (err) {
    throw err;
  }
};
