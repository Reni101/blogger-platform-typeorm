import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { GameQuestion } from './game.question';
import { Answer } from './answer.entity';

export const questionBodyConstraints = {
    minLength: 10,
    maxLength: 500,
};

@Entity({ name: 'questions' })
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: questionBodyConstraints.maxLength })
    body: string;

    @Column('text', { array: true })
    correctAnswers: string[];

    @Column({ type: 'boolean', default: false })
    published: boolean;

    @OneToMany(() => GameQuestion, (gq) => gq.question)
    gameQuestions: GameQuestion[];

    @OneToMany(() => Answer, (a) => a.question)
    answers: Answer[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date | null;
}
