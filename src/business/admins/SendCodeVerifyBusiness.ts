import config, {configSendEmail} from '@src/config';
import AdminRepository from '@src/repository/AdminRepository';
import {EmailConfig, logger} from 'bo-trading-common/lib/utils';
import handlebars from 'handlebars';

export const SendCodeVerifyBusiness = async (id: string): Promise<boolean> => {
  try {
    const adminRes = new AdminRepository();
    const admin = await adminRes.findById(id);
    if (admin) {
      const faker = require('faker');
      const code = process.env.NODE_ENV !== 'production' ? '654321' : faker.vehicle.vrm();
      adminRes.renderCodeVerify(admin.id, code);

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
    }
  } catch (err) {
    throw err;
  }
};
