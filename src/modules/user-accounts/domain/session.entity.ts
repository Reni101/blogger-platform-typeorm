import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'sessions' })
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid' })
    deviceId: string;

    @Column({ type: 'varchar' })
    deviceName: string;

    @Column({ type: 'varchar' })
    ip: string;

    @Column({ type: 'bigint' })
    iat: number;

    @Column({ type: 'bigint' })
    exp: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.sessions)
    user: User;

    @Column()
    userId: number;
}
