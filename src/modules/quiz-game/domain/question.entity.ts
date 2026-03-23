import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @Column({ type: 'jsonb' })
    correctAnswers: string[];

    @Column({ type: 'boolean', default: false })
    published: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date | null;
}
