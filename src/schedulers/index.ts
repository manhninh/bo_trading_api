import ImportERC20Deposits from '@src/controllers/wallet/ImportERC20Deposits';
import ImportSystemERC20Deposits from '@src/controllers/wallet/ImportSystemERC20Deposits';
import ImportSystemTRC20Deposits from '@src/controllers/wallet/ImportSystemTRC20Deposits';
import ImportTRC20Deposits from '@src/controllers/wallet/ImportTRC20Deposits';
import ScheduleVerifyTX from '@src/controllers/wallet/ScheduleVerifyTX';
import scheduler from 'node-schedule';

export default class Scheduler {
  public config() {
    scheduler.scheduleJob('*/5 * * * *', ImportTRC20Deposits);
    scheduler.scheduleJob('*/5 * * * *', ImportERC20Deposits);
    scheduler.scheduleJob('*/3 * * * *', ImportSystemTRC20Deposits);
    scheduler.scheduleJob('*/3 * * * *', ImportSystemERC20Deposits);

    // Withdraw check status transaction
    scheduler.scheduleJob('*/4 * * * *', ScheduleVerifyTX);

    // scheduler.scheduleJob('29 * * * * *', randomOrder);
  }
}
