import config, {configSendEmail} from '@src/config';
import AdminRepository from '@src/repository/AdminRepository';
import {createHashedSalt} from '@src/utils/SecurityPass';
import {SendCodeLoginValidator} from '@src/validator/admins/SendCodeLoginValidator';
import {EmailConfig, logger} from 'bo-trading-common/lib/utils';
import {validate} from 'class-validator';
import handlebars from 'handlebars';

export const SendCodeLoginBusiness = async (obj: SendCodeLoginValidator): Promise<boolean> => {
  try {
    const validation = await validate(obj);
    if (validation.length > 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    } else {
      const adminRes = new AdminRepository();
      const admin = await adminRes.findOne({email: obj.email});
      if (admin) {
        const faker = require('faker');
        const code = process.env.NODE_ENV !== 'production' ? '654321' : faker.vehicle.vrm();
        const {salt, hashedPassword} = createHashedSalt(code);
        adminRes.updateNewCode(admin.id, salt, hashedPassword);
        /** gửi email verification */
        const emailConfig = new EmailConfig(configSendEmail);
        emailConfig.readHTMLFile(`${config.PATH_TEMPLATE_EMAIL}/send_code.html`, (html: string) => {
          const template = handlebars.compile(html);
          const replacements = {codeVerify: code};
          const htmlToSend = template(replacements);
          emailConfig
            .send(config.EMAIL_ROOT, admin.email, 'Verify Code Admin', htmlToSend)
            .catch((err) => logger.error(err.message));
        });
        return true;
      } else throw new Error('Email not exist!');
    }
  } catch (err) {
    throw err;
  }
};
