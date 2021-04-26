import CommissionRepository from '@src/repository/CommissionRepository';
import { CommissionTradeDetailValidator } from '@src/validator/commissions/CommissionTradeDetailValidator';
import { ICommissionModel } from 'bo-trading-common/lib/models/commissions';
import { validate } from 'class-validator';

export const CommissionTradeDetailBusiness = async (
  obj: CommissionTradeDetailValidator,
): Promise<ICommissionModel[]> => {
  try {
    const validation = await validate(obj);
    if (validation.length !== 0) throw new Error(Object.values(validation[0].constraints)[0]);
    const commissionRes = new CommissionRepository();
    const result = await commissionRes.commissionTradeDetail(obj.userId, obj.fromDate, obj.toDate, obj.page, obj.limit);
    return result;
  } catch (err) {
    throw err;
  }
};
