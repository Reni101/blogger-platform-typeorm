import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeStatusEnum } from './const/LikeStatusEnum';
import { User } from '../../user-accounts/domain/user.entity';
import { Post } from './post.entity';

@Entity({ name: 'post_reaction' })
export class PostReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    status: LikeStatusEnum;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (u) => u.postsReactions)
    user: User;
    @Column()
    userId: number;

    @ManyToOne(() => Post, (p) => p.postsReactions)
    post: Post;
    @Column()
    postId: number;
}
