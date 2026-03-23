import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestion1774275512525 implements MigrationInterface {
    name = 'AddQuestion1774275512525';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "body" character varying(500) NOT NULL, "correctAnswers" jsonb NOT NULL, "published" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "questions"`);
    }
}
