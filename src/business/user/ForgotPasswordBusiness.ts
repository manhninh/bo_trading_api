import config, {configSendEmail} from '@src/config';
import UserRepository from '@src/repository/UserRepository';
import {createHashedSalt} from '@src/utils/SecurityPass';
import {ForgotPasswordValidator} from '@src/validator/users/ForgotPassword';
import {EmailConfig, logger} from 'bo-trading-common/lib/utils';
import {validate} from 'class-validator';
import handlebars from 'handlebars';

export const forgotPasswordBusiness = async (obj: ForgotPasswordValidator): Promise<boolean> => {
  try {
    const validation = await validate(obj);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      const userRes = new UserRepository();
      const user = await userRes.findOne({email: obj.email});
      if (user) {
        const faker = require('faker');
        const newPassword = process.env.NODE_ENV !== 'production' ? '654321' : faker.internet.password();
        const {salt, hashedPassword} = createHashedSalt(newPassword);
        userRes.updateNewPassword(user.id, salt, hashedPassword);

        /** gửi email verification */
        const emailConfig = new EmailConfig(configSendEmail);
        emailConfig.readHTMLFile(`${config.PATH_TEMPLATE_EMAIL}/send_code.html`, (html: string) => {
          const template = handlebars.compile(html);
          const replacements = {codeVerify: newPassword};
          const htmlToSend = template(replacements);
          emailConfig
            .send(config.EMAIL_ROOT, user.email, 'Forgot Password', htmlToSend)
            .catch((err) => logger.error(err.message));
        });
        return true;
      } else throw new Error('Email not exist!');
    }
  } catch (err) {
    throw err;
  }
};
