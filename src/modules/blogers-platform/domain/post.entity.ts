import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';

export const titleConstraints = {
    minLength: 1,
    maxLength: 30,
};

export const shortDescriptionConstraints = {
    minLength: 1,
    maxLength: 100,
};
export const contentDescriptionConstraints = {
    minLength: 1,
    maxLength: 1000,
};
@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: titleConstraints.maxLength })
    title: string;

    @Column({ type: 'varchar', length: shortDescriptionConstraints.maxLength })
    shortDescription: string;

    @Column({
        type: 'varchar',
        length: contentDescriptionConstraints.maxLength,
    })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Blog, (b) => b.posts)
    blog: Blog;

    @Column()
    blogId: number;

    @OneToMany(() => Comment, (c) => c.post)
    comments: Comment[];
}
