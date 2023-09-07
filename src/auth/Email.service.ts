/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize the nodemailer transporter using SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_FROM_EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      // Send the email
      await this.transporter.sendMail({
        from: process.env.GOOGLE_FROM_EMAIL,
        to,
        subject,
        text,
      });
    } catch (error) {
      // Handle email sending errors
      throw new Error('Error sending email: ' + error.message);
    }
  }
}
