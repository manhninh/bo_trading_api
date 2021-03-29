import config from '@src/config';
import { readFile } from 'fs';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export default class EmailConfig {
  private _transporter: Mail;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'email-smtp.us-west-2.amazonaws.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: { user: config.NODEMAILER_USER, pass: config.NODEMAILER_PASS, },
    });
  }

  public send(from: string, to: string, subject: string, body: any, attachments?: any): Promise<any> {
    try {
      return this._transporter.sendMail({ from, to, subject, html: body, attachments, });
    } catch (error) {
      throw error;
    }
  }

  public readHTMLFile(path: string, callback: (html: string) => void) {
    readFile(path, { encoding: 'utf-8' }, (err, html) => {
      if (err) throw err;
      else callback(html);
    });
  }
}
