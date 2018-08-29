import * as sendGridInstance from '@sendgrid/mail';

import { Mailer, MailerMessage } from './Mailers';

import { Config } from '../config/Config';
import { Service } from 'typedi';

@Service()
export class SendGridMailer extends Mailer {
  public constructor() {
    super();
    // Sendgrid works with a singleton instance, which needs to be configured with the api key.
    sendGridInstance.setApiKey(Config.get('SENDGRID_KEY'));
  }

  public async send(message: MailerMessage) {
    try {
      const result = await sendGridInstance.send(message);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
