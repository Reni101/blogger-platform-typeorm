import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

export const nameConstraints = {
    minLength: 1,
    maxLength: 15,
};
export const descriptionConstraints = {
    minLength: 1,
    maxLength: 300,
};
@Entity({ name: 'blogs' })
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: nameConstraints.maxLength,
        collation: 'C',
    })
    name: string;

    @Column({ type: 'varchar', length: descriptionConstraints.maxLength })
    description: string;

    @Column({ type: 'varchar' })
    websiteUrl: string;

    @Column({ type: 'boolean' })
    isMembership: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Post, (p) => p.blog)
    posts: Post[];
}
