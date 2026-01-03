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

    @Column({ type: 'varchar', length: loginConstraints.maxLength })
    login: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    passwordHash: string;

    @Column({ type: 'uuid' })
    confirmationCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @OneToOne(
        () => EmailConfirmation,
        (emailConfirmation) => emailConfirmation.user,
    )
    emailConfirmation: EmailConfirmation;

    @OneToMany(() => Session, (sessions) => sessions.user) // note: we will create author property in the Photo class below
    sessions: Session[];

    async softDelete() {
        this.deletedAt = new Date();
    }
}
