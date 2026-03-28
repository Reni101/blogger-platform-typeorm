import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../domain/answer.entity';
import { Repository } from 'typeorm';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { AnswerViewDto } from '../api/view-dto/anser.view-dto';

@Injectable()
export class AnswerQueryRepository {
    constructor(
        @InjectRepository(Answer) private answersRepository: Repository<Answer>,
    ) {}

    async getByIdOrThrow(id: number) {
        const answer = await this.answersRepository.findOneBy({ id });

        if (!answer) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'NotFound',
            });
        }
        return AnswerViewDto.mapToView(answer);
    }
}
