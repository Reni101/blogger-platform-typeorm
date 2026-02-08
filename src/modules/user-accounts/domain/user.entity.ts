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
import { Comment } from '../../blogers-platform/domain/comment.entity';
import { CommentReaction } from '../../blogers-platform/domain/comment-reaction.entity';
import { PostReaction } from '../../blogers-platform/domain/post-reaction.entity';

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

    @OneToMany(() => Session, (sessions) => sessions.user)
    comments: Comment[];

    @OneToMany(() => CommentReaction, (cr) => cr.user)
    commentsReactions: CommentReaction[];

    @OneToMany(() => CommentReaction, (pr) => pr.user)
    postsReactions: PostReaction[];

    async softDelete() {
        this.deletedAt = new Date();
    }
}
