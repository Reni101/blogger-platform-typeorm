import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/session.schema';

@Injectable()
export class SessionsQueryRepository {
    constructor(
        @InjectModel(Session.name) private sessionModel: SessionModelType,
    ) {}

    async getSessions(userId: number) {
        return this.sessionModel.find({ userId });
    }
}
