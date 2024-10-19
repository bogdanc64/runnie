import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from "path";

export const appConfig = () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    API_URL: process.env.API_URL,
    PROTOCOL: process.env.PROTOCOL,
});

export const emailConfig = {
  transport: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  defaults: {
    from: `"Runnie" < ${process.env.SMTP_USER} >`,
  },
  template: {
    dir: path.join(__dirname, '../common/', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}
  