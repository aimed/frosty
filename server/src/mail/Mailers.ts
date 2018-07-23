import { Config } from '../config/Config';
import { Service } from 'typedi';

export interface MailerMessagePlain {
  to: string;
  from: string;
  subject: string;
  text: string;
}

export interface MailerMessageHTML {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export type MailerMessage = MailerMessagePlain | MailerMessageHTML;

@Service()
export abstract class Mailer {
  public static get DefaultFromAddress(): string {
    return Config.get('DEFAULT_EMAIL_FROM');
  }
  public abstract send(message: MailerMessage): Promise<void>;
}
