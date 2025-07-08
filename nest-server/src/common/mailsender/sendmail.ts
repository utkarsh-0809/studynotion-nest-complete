// mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

// @Injectable()
export class MailService {
  private transporter:any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });
  }

  async sendMail(email: string, title: string, body: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`,
        to: email,
        subject: title,
        html: body,
      });

      console.log(info.response);
      return info;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
