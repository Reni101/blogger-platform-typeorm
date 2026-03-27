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
import { GameQuestion } from './game.question';

export enum GameStatus {
    Active = 'Active',
    Pending = 'PendingSecondPlayer',
    Finished = 'Finished',
}

@Entity({ name: 'games' })
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', default: GameStatus.Pending })
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

    @OneToMany(() => GameQuestion, (gq) => gq.game)
    gameQuestions: GameQuestion[];

    @CreateDateColumn()
    pairCreatedDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    startGameDate: Date | null;
    @Column({ type: 'timestamp', nullable: true })
    finishGameDate: Date | null;
}
