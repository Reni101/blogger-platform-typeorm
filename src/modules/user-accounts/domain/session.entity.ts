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

    @Column({ type: 'varchar' })
    deviceId: string;

    @Column({ type: 'varchar' })
    deviceName: string;

    @Column({ type: 'varchar' })
    ip: string;

    @Column({ type: 'bigint' })
    iat: string;

    @Column({ type: 'bigint' })
    exp: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.sessions)
    user: User;

    @Column()
    userId: number;
}
