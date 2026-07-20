import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Session,
    SessionDocument,
    SessionModelType,
} from '../domain/session.schema';
import { CreateSessionDomainDto } from '../domain/dto/create-session.domain.dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { Types } from 'mongoose';

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectModel(Session.name) private sessionModel: SessionModelType,
    ) {}

    createSession(dto: CreateSessionDomainDto) {
        return this.sessionModel.createInstance(dto);
    }
    async findByIatAndDeviceId(iat: number, deviceId: string) {
        return this.sessionModel.findOne({ iat, deviceId });
    }

    async save(session: SessionDocument) {
        await session.save();
    }

    async findOrThrow(dto: { iat: number; deviceId: string }) {
        const session = await this.findByIatAndDeviceId(dto.iat, dto.deviceId);
        if (!session) {
            throw new DomainException({
                code: DomainExceptionCode.Unauthorized,
                message: 'session not found',
            });
        }

        return session;
    }

    async findByDeviceIdOrThrow(deviceId: string) {
        const session = await this.sessionModel.findOne({ deviceId });
        if (!session) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'session not found',
            });
        }
        return session;
    }

    async deleteOtherSessions(userId: number, sessionId: Types.ObjectId) {
        return this.sessionModel.deleteMany({
            userId,
            _id: { $ne: sessionId },
        });
    }
}
