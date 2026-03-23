import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetQuestionsQueryParams } from './input-dto/get-questions-query.params.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { QuestionsQueryRepository } from '../infastructure/questions-query.repository';
import { ApiSecurity } from '@nestjs/swagger';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/bacis-auth.guard';
import { CreateQuestionInputDto } from './input-dto/question.input-dto';
import { CreateQuestionCommand } from '../application/use-cases/create-question.use-case';

@ApiSecurity('basic')
@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
export class SaQuizController {
    constructor(
        private commandBus: CommandBus,
        private questionsQueryRepository: QuestionsQueryRepository,
    ) {}

    @Get()
    async getAll(@Query() query: GetQuestionsQueryParams) {
        return this.questionsQueryRepository.getQuestions(query);
    }

    @Post()
    async createUser(@Body() body: CreateQuestionInputDto) {
        return this.commandBus.execute<CreateQuestionCommand, any>(
            new CreateQuestionCommand(body),
        );
    }
}
