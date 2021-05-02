import UserRepository from '@src/repository/UserRepository';
import {IUserModel} from 'bo-trading-common/lib/models/users';
import {createUSDTERC20, createUSDTTRC20} from './CreateWalletBusiness';

export const createRandomUserBusiness = async (): Promise<Boolean> => {
  try {
    const faker = require('faker');
    const userRes = new UserRepository();
    /** tạo url để gửi verification email */
    const uuid = faker.datatype.uuid();
    for (let index = 0; index < 1000; index++) {
      /** create user */
      const user = await userRes.create(<IUserModel>{
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        verify_code: uuid,
        ref_code: faker.vehicle.vrm(),
        status: 1,
      });
      if (!user) throw new Error('Create user fail!');

      /** tạo wallets cho tài khoản */
      // TODO: Tạo ví người dùng - TRC20
      createUSDTTRC20(user).then(() => {
        // TODO: Tạo ví người dùng - ERC20
        createUSDTERC20(user);
      });
    }
    return true;
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000 && err.keyValue.username != null) {
      throw new Error('Username already exists!');
    } else if (err.name === 'MongoError' && err.code === 11000 && err.keyValue.email != null) {
      throw new Error('Email already exists!');
    } else throw err;
  }
};
