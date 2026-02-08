import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../user-accounts/domain/user.entity';

export const contentConstraints = {
    minLength: 20,
    maxLength: 300,
};
@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: contentConstraints.maxLength })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Post, (p) => p.comments)
    post: Post;
    @Column()
    postId: number;

    @ManyToOne(() => User, (u) => u.comments)
    user: User;
    @Column()
    userId: number;
}
