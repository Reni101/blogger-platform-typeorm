import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { GameQueryRepository } from '../infastructure/game-query.repository';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionCommand } from '../application/use-cases/connection.use-case';

@Controller('pair-game-quiz')
export class QuizGameController {
    constructor(
        private gameQueryRepository: GameQueryRepository,
        private commandBus: CommandBus,
    ) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('pairs/my-current')
    async getCurrentGameOrThrow(
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        return this.gameQueryRepository.getCurrentGameOrThrow(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(`pairs/:id`)
    async getGameById(
        @Param('id', ParseUUIDPipe) id: string,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        const game = await this.gameQueryRepository.findGameByIdOrThrow(id);

        const userId = String(user.id);

        const isParticipant =
            game.firstPlayerProgress.player.id === userId ||
            game.secondPlayerProgress?.player.id === userId;

        if (!isParticipant) {
            throw new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'you are not a participant of this game',
            });
        }

        return game;
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(`pairs/connection`)
    async connection(@ExtractUserFromRequest() user: UserContextDto) {
        const gameId = await this.commandBus.execute<ConnectionCommand, string>(
            new ConnectionCommand(user.id),
        );

        return this.gameQueryRepository.findGameByIdOrThrow(gameId);
    }
}
