import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../domain/player.entity';
import { Repository } from 'typeorm';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class PlayerRepository {
    constructor(
        @InjectRepository(Player) private playersRepository: Repository<Player>,
    ) {}

    async createPlayer(userId: number) {
        const player = this.playersRepository.create({ userId });
        await this.playersRepository.save(player);
        return player;
    }

    async findPlayerOrThrow(playerId: number) {
        const player = await this.playersRepository.findOne({
            where: { id: playerId },
        });

        if (!player) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'error',
            });
        }
        return player;
    }

    async save(player: Player) {
        return this.playersRepository.save(player);
    }
}
