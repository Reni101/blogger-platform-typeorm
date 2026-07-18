import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../domain/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsQueryRepository {
    constructor(
        @InjectRepository(Session)
        private sessionsRepository: Repository<Session>,
    ) {}

    async getSessions(userId: number) {
        return this.sessionsRepository.find({ where: { userId } });
    }
}
