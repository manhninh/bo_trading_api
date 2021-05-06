import {PROTECT_STATUS} from '@src/contants/System';
import {EMITS} from '@src/socketHandlers/EmitType';

export const ActivateExchangeProtectionBusiness = (protectStatus: PROTECT_STATUS): boolean => {
  try {
    global.ioCalculator.emit(EMITS.CHANGE_PROTECT_STATUS, protectStatus);
    return true;
  } catch (err) {
    throw err;
  }
};
