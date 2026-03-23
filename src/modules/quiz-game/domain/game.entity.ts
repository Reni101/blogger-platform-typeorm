import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'games' })
export class Game {
    @PrimaryGeneratedColumn()
    id: number;
}
