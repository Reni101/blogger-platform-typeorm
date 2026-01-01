import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../domain/session.entity';
import { CreateSessionDomainDto } from '../domain/dto/create-session.domain.dto';

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectRepository(Session)
        private sessionsRepository: Repository<Session>,
    ) {}

    async createSession(dto: CreateSessionDomainDto) {
        const session = this.sessionsRepository.create({
            userId: dto.userId,
            exp: dto.exp,
            iat: dto.iat,
            deviceId: dto.deviceId,
            deviceName: dto.deviceName,
            ip: dto.ip,
        });
        await this.sessionsRepository.save(session);
    }
}
