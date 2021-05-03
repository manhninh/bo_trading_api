import ImportSystemTRC20Deposits from '@src/controllers/wallet/ImportSystemTRC20Deposits';
import ImportTRC20Deposits from '@src/controllers/wallet/ImportTRC20Deposits';
import ScheduleVerifyTX from '@src/controllers/wallet/ScheduleVerifyTX';
import scheduler from 'node-schedule';
export default class Scheduler {
  public config() {
    // scheduler.scheduleJob(config.SCHEDULE_EXECUTE_EVERY_MINUTE, executeEveryMinute);
    scheduler.scheduleJob('*/1 * * * *', ImportTRC20Deposits);
    scheduler.scheduleJob('*/1 * * * *', ImportSystemTRC20Deposits);
    scheduler.scheduleJob('*/5 * * * *', ScheduleVerifyTX);
  }
}
