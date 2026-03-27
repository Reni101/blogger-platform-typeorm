import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Question } from './question.entity';

@Entity({ name: 'game_question' })
export class GameQuestionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    index: number;

    @ManyToOne(() => Game, (g) => g.gameQuestions)
    @JoinColumn()
    game: Game;

    @Column()
    gameId: string;

    @ManyToOne(() => Question, (q) => q.gameQuestions)
    @JoinColumn()
    question: Question;

    @Column()
    questionId: number;
}
