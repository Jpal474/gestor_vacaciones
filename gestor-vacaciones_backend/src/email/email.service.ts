import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // o el proveedor de correo que vayas a utilizar
      auth: {
        user: process.env.USER_MAIL, // tu dirección de correo
        pass: process.env.PASS_MAIL,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.USER_MAIL, // tu dirección de correo
      to,
      subject,
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendMailTrabajador(
    to: string[],
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.USER_MAIL, // tu dirección de correo
      to: to.join(','),
      subject,
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
