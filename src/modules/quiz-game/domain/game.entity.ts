import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { GameQuestionEntity } from './game-question.entity';

export enum GameStatus {
    Active = 'active',
    PendingSecondPlayer = 'pendingSecondPlayer',
    Finished = 'finished',
}

@Entity({ name: 'games' })
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', default: GameStatus.PendingSecondPlayer })
    status: GameStatus;

    @OneToOne(() => Player, { cascade: true })
    @JoinColumn()
    playerOne: Player | null;

    @Column()
    playerOneId: number;

    @OneToOne(() => Player, { nullable: true, cascade: true })
    @JoinColumn()
    playerTwo: Player | null;

    @Column({ type: 'int', nullable: true })
    playerTwoId: number | null;

    @OneToMany(() => GameQuestionEntity, (gq) => gq.game)
    gameQuestions: GameQuestionEntity[];

    @CreateDateColumn()
    pairCreatedDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    startGameDate: Date | null;
    @Column({ type: 'timestamp', nullable: true })
    finishGameDate: Date | null;
}
