import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Question } from './question.entity';
import { Game } from './game.entity';

export enum AnswerStatus {
    Correct = 'Correct',
    Incorrect = 'Incorrect',
}

@Entity({ name: 'answers' })
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    answer: string;

    @Column({ type: 'text' })
    status: AnswerStatus;

    @CreateDateColumn()
    addedAt: Date;

    @ManyToOne(() => Player, (p) => p.answers)
    player: Player;

    @Column()
    playerId: number;

    @ManyToOne(() => Question, (q) => q.answers)
    question: Question;

    @Column()
    questionId: number;

    @ManyToOne(() => Game, (g) => g.answers)
    game: Game;

    @Column()
    gameId: number;
}
