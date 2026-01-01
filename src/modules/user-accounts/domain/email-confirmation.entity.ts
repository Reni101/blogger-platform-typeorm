import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'email_confirmation' })
export class EmailConfirmation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', generated: 'uuid' })
    confirmationCode: string;

    @Column({ type: 'timestamp with time zone' })
    expirationDate: Date;

    @Column({ type: 'boolean', default: false })
    isConfirmed: boolean;

    @OneToOne(() => User, (user) => user.emailConfirmation)
    @JoinColumn()
    user: User;

    @Column()
    userId: number;
}
