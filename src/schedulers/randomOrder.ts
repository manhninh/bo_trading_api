import {CreateOrderBusiness} from '@src/business/orders/CreateOrderBusiness';
import UserRepository from '@src/repository/UserRepository';
import {random} from '@src/utils/Formatter';
import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';
import {logger} from 'bo-trading-common/lib/utils';

export default (date: Date) => {
  try {
    if (global.openTrade) {
      const userRes = new UserRepository();
      const faker = require('faker');
      userRes.findAll().then((user) => {
        Promise.all(
          user.map(async (item) => {
            const data = new CreateOrderValidator();
            data.userId = item.id;
            data.typeUser = item.type_user;
            data.typeOrder = Number(faker.datatype.boolean());
            data.amount = random(1, 2);
            await CreateOrderBusiness(data, item.username);
          }),
        );
      });
    }
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
