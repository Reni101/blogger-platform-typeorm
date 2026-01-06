import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfirmation } from '../domain/email-confirmation.entity';

@Injectable()
export class EmailConfirmationRepository {
    constructor(
        @InjectRepository(EmailConfirmation)
        private emailConfRepository: Repository<EmailConfirmation>,
    ) {}
    async findByCode(code: string) {
        return this.emailConfRepository.findOneBy({
            confirmationCode: code,
        });
    }
    async save(data: EmailConfirmation) {
        await this.emailConfRepository.save(data);
    }
}
