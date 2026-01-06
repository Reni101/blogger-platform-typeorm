import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../domain/session.entity';
import { CreateSessionDomainDto } from '../domain/dto/create-session.domain.dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectRepository(Session)
        private sessionsRepository: Repository<Session>,
    ) {}

    async createSession(dto: CreateSessionDomainDto) {
        const session = this.sessionsRepository.create({
            userId: dto.userId,
            exp: dto.exp.toString(),
            iat: dto.iat.toString(),
            deviceId: dto.deviceId,
            deviceName: dto.deviceName,
            ip: dto.ip,
        });
        await this.sessionsRepository.save(session);
    }

    async findOrThrow(dto: { iat: string; deviceId: string }) {
        const session = await this.sessionsRepository.findOne({
            where: { deviceId: dto.deviceId, iat: dto.iat },
        });
        if (!session) {
            throw new DomainException({
                code: DomainExceptionCode.Unauthorized,
                message: 'session not found',
            });
        }
        return session;
    }
    async findByDeviceIdOrThrow(deviceId: string) {
        const session = await this.sessionsRepository.findOne({
            where: { deviceId },
        });
        if (!session) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'session not found',
            });
        }
        return session;
    }

    async deleteSession(id: number) {
        await this.sessionsRepository.delete({ id });
    }
    async deleteOtherSessions(dto: { userId: number; sessionId: number }) {
        return this.sessionsRepository
            .createQueryBuilder()
            .delete()
            .where('userId = :userId', { userId: dto.userId })
            .andWhere('id !=:id', { id: dto.sessionId })
            .execute();
    }
    async save(session: Session) {
        await this.sessionsRepository.save(session);
    }
}
