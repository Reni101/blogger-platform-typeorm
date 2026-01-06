import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailConfirmation } from './email-confirmation.entity';
import { Session } from './session.entity';

export const loginConstraints = {
    minLength: 3,
    maxLength: 10,
};

export const passwordConstraints = {
    minLength: 6,
    maxLength: 20,
};

export const emailConstraints = {
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: loginConstraints.maxLength,
        collation: 'C',
    })
    login: string;

    @Column({ type: 'varchar', collation: 'C' })
    email: string;

    @Column({ type: 'varchar' })
    passwordHash: string;

    @Column({ type: 'uuid', nullable: true })
    recoveryCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @OneToOne(
        () => EmailConfirmation,
        (emailConfirmation) => emailConfirmation.user,
        { cascade: true },
    )
    emailConfirmation: EmailConfirmation;

    @OneToMany(() => Session, (sessions) => sessions.user)
    sessions: Session[];

    async softDelete() {
        this.deletedAt = new Date();
    }
}
