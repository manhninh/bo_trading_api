import ImportSystemTRC20Deposits from '@src/controllers/wallet/ImportSystemTRC20Deposits';
import ImportTRC20Deposits from '@src/controllers/wallet/ImportTRC20Deposits';
import scheduler from 'node-schedule';
export default class Scheduler {
  public config() {
    // scheduler.scheduleJob(config.SCHEDULE_EXECUTE_EVERY_MINUTE, executeEveryMinute);
    scheduler.scheduleJob('*/5 * * * *', ImportTRC20Deposits);
    scheduler.scheduleJob('*/5 * * * *', ImportSystemTRC20Deposits);
  }
}