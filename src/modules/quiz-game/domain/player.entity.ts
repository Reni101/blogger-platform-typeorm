import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { User } from '../../user-accounts/domain/user.entity';

export enum PlayerStatus {
    Win = 'win',
    Lose = 'lose',
    Draw = 'draw',
}

@Entity({ name: 'players' })
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (u) => u.players)
    user: User;

    @Column()
    userId: number;

    @OneToMany(() => Answer, (a) => a.player)
    answers: Answer[];

    @Column({ type: 'int', default: 0 })
    score: number;

    @Column({ type: 'text', nullable: true, default: null })
    status: PlayerStatus | null;
}
