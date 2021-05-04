import {CreateOrderBusiness} from '@src/business/orders/CreateOrderBusiness';
import UserRepository from '@src/repository/UserRepository';
import {random} from '@src/utils/Formatter';
import {CreateOrderValidator} from '@src/validator/orders/CreateOrder';

export default async () => {
  try {
    const userRes = new UserRepository();
    const faker = require('faker');
    const user = await userRes.findAll();
    user.map(async (item) => {
      const data = new CreateOrderValidator();
      data.userId = item.id;
      data.typeUser = item.type_user;
      data.typeOrder = Number(faker.datatype.boolean());
      data.amount = random(1, 2);
      data.username = item.username;
      await CreateOrderBusiness(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};
