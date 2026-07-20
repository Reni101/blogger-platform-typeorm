import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteSession1784530208820 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`,
        );
        await queryRunner.query(`DROP TABLE "sessions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "deviceId" character varying NOT NULL, "deviceName" character varying NOT NULL, "ip" character varying NOT NULL, "iat" bigint NOT NULL, "exp" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
