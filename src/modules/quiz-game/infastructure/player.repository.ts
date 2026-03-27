import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../domain/player.entity';
import { Repository } from 'typeorm';

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

    async save(player: Player) {
        return this.playersRepository.save(player);
    }
}
