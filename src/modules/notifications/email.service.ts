import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        //can add html templates, implement advertising and other logic for mailing...

        const html = `
            <h1>Thanks for your registration</h1>
            <p>To finish registration, use the code below:</p>
            <p><strong>${code}</strong></p>
        `;

        await this.mailerService.sendMail({
            html,
            subject: 'Registration',
            to: email,
        });
    }

    async resendEmail(email: string, code: string): Promise<void> {
        //can add html templates, implement advertising and other logic for mailing...

        const html = `
            <h1>Complete Registration</h1>
            <p>Your new confirmation code:</p>
            <p><strong>${code}</strong></p>
        `;

        await this.mailerService.sendMail({
            html,
            subject: 'New code',
            to: email,
        });
    }
    async passwordRecoveryEmail(email: string, code: string): Promise<void> {
        const html = `
            <h1>Password recovery</h1>
            <p>Your password recovery code:</p>
            <p><strong>${code}</strong></p>
        `;

        await this.mailerService.sendMail({
            html,
            subject: 'New password',
            to: email,
        });
    }
}
