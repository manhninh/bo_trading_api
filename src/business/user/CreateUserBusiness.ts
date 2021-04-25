import config, {configSendEmail} from '@src/config';
import UserRepository from '@src/repository/UserRepository';
import {CreateUserValidator} from '@src/validator/users/CreateUser';
import {IUserModel} from 'bo-trading-common/lib/models/users';
import {EmailConfig, logger} from 'bo-trading-common/lib/utils';
import {validate} from 'class-validator';
import handlebars from 'handlebars';
import {createUSDTTRC20} from './CreateWalletBusiness';

export const createUserBusiness = async (account: CreateUserValidator): Promise<Boolean> => {
  try {
    const validation = await validate(account);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      const faker = require('faker');
      const userRes = new UserRepository();
      /** tạo url để gửi verification email */
      const uuid = faker.datatype.uuid();

      /** create user */
      const user = await userRes.create(<IUserModel>{
        username: account.username.toLowerCase(),
        email: account.email,
        password: account.password,
        verify_code: uuid,
        ref_code: faker.vehicle.vrm(),
      });
      if (!user) throw new Error('Create user fail!');
      /** thêm phân cấp hoa hồng */
      if (account.referralUser) {
        userRes.findOne({ref_code: account.referralUser, type_user: 0}).then((userParent) => {
          if (!userParent) return;
          let commissionLevel = [];
          /** nếu đã có danh sách level thì lấy ra 7 level cuối cùng, nếu không thêm referral hiện tại làm level 1 */
          if (userParent.commission_level.length > 0) commissionLevel = [...userParent.commission_level.slice(-7)];
          commissionLevel.push(userParent.id);
          userRes.updateById(user.id, {commission_level: commissionLevel});
        });
      }

      /** tạo wallets cho tài khoản */
      // TODO: Tạo ví người dùng - TRC20
      createUSDTTRC20(user);
      // TODO: Tạo ví người dùng - ERC20

      /** gửi email verification */
      const emailConfig = new EmailConfig(configSendEmail);
      emailConfig.readHTMLFile(`${config.PATH_TEMPLATE_EMAIL}/verification_email.html`, (html: string) => {
        const template = handlebars.compile(html);
        const replacements = {
          linkVerification: config.URL_WEB_VERIFICATION_EMAIL + uuid,
        };
        const htmlToSend = template(replacements);
        emailConfig
          .send(config.EMAIL_ROOT, user.email, 'Verify your account', htmlToSend)
          .catch((err) => logger.error(err.message));
      });
      return true;
    }
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000 && err.keyValue.username != null) {
      throw new Error('Username already exists!');
    } else if (err.name === 'MongoError' && err.code === 11000 && err.keyValue.email != null) {
      throw new Error('Email already exists!');
    } else throw err;
  }
};
