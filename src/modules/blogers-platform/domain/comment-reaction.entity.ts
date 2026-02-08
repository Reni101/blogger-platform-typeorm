import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeStatusEnum } from './const/LikeStatusEnum';
import { User } from '../../user-accounts/domain/user.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'comment_reaction' })
export class CommentReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    status: LikeStatusEnum;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (u) => u.commentsReactions)
    user: User;
    @Column()
    userId: number;

    @ManyToOne(() => Comment, (u) => u.commentsReactions)
    comment: Comment;
    @Column()
    commentId: number;
}
