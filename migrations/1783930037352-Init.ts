import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1783930037352 implements MigrationInterface {
    name = 'Init1783930037352';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "email_confirmation" ("id" SERIAL NOT NULL, "confirmationCode" uuid NOT NULL DEFAULT uuid_generate_v4(), "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "isConfirmed" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, CONSTRAINT "REL_28d3d3fbd7503f3428b94fd18c" UNIQUE ("userId"), CONSTRAINT "PK_ff2b80a46c3992a0046b07c5456" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "deviceId" character varying NOT NULL, "deviceName" character varying NOT NULL, "ip" character varying NOT NULL, "iat" bigint NOT NULL, "exp" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "name" character varying(15) COLLATE "C" NOT NULL, "description" character varying(300) NOT NULL, "websiteUrl" character varying NOT NULL, "isMembership" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(30) NOT NULL, "shortDescription" character varying(100) NOT NULL, "content" character varying(1000) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "blogId" integer NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" character varying(300) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "comment_reaction" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "commentId" integer NOT NULL, CONSTRAINT "PK_87f27d282c06eb61b1e0cde2d24" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "games" ("id" SERIAL NOT NULL, "status" text NOT NULL DEFAULT 'PendingSecondPlayer', "playerOneId" integer NOT NULL, "playerTwoId" integer, "pairCreatedDate" TIMESTAMP NOT NULL DEFAULT now(), "startGameDate" TIMESTAMP, "finishGameDate" TIMESTAMP, CONSTRAINT "REL_f9d1d99333703f884ff1d04790" UNIQUE ("playerOneId"), CONSTRAINT "REL_163237722e3676d314c7245687" UNIQUE ("playerTwoId"), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "game_question" ("id" SERIAL NOT NULL, "index" integer NOT NULL, "gameId" integer NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_08867ba249fa9d179d5449d27d3" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "body" character varying(500) NOT NULL, "correctAnswers" text array NOT NULL, "published" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "answers" ("id" SERIAL NOT NULL, "answer" text NOT NULL, "status" text NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "playerId" integer NOT NULL, "questionId" integer NOT NULL, "gameId" integer NOT NULL, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "players" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "score" integer NOT NULL DEFAULT '0', "status" text, CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying(10) COLLATE "C" NOT NULL, "email" character varying COLLATE "C" NOT NULL, "passwordHash" character varying NOT NULL, "recoveryCode" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "post_reaction" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_72c5fe23f6a0f35b8c2ba78945f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "email_confirmation" ADD CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_55d9c167993fed3f375391c8e31" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment_reaction" ADD CONSTRAINT "FK_92536a1358ea6b6611812f62f3a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment_reaction" ADD CONSTRAINT "FK_88bb607240417f03c0592da6824" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "games" ADD CONSTRAINT "FK_f9d1d99333703f884ff1d04790e" FOREIGN KEY ("playerOneId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "games" ADD CONSTRAINT "FK_163237722e3676d314c72456873" FOREIGN KEY ("playerTwoId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "game_question" ADD CONSTRAINT "FK_d35bdfc9ff116d456dcad4a580e" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "game_question" ADD CONSTRAINT "FK_0040e663701d18ed9d1c49ecf6b" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" ADD CONSTRAINT "FK_2db19a3852a73462e7532965c82" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" ADD CONSTRAINT "FK_b3eca5ab80047270a79e7e8ef99" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "players" ADD CONSTRAINT "FK_7c11c744c0601ab432cfa6ff7ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "post_reaction" ADD CONSTRAINT "FK_5019c594c963270ac7a6bfafbec" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "post_reaction" ADD CONSTRAINT "FK_5e7b98f3cea583c73a0bbbe0de1" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post_reaction" DROP CONSTRAINT "FK_5e7b98f3cea583c73a0bbbe0de1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "post_reaction" DROP CONSTRAINT "FK_5019c594c963270ac7a6bfafbec"`,
        );
        await queryRunner.query(
            `ALTER TABLE "players" DROP CONSTRAINT "FK_7c11c744c0601ab432cfa6ff7ad"`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" DROP CONSTRAINT "FK_b3eca5ab80047270a79e7e8ef99"`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" DROP CONSTRAINT "FK_2db19a3852a73462e7532965c82"`,
        );
        await queryRunner.query(
            `ALTER TABLE "game_question" DROP CONSTRAINT "FK_0040e663701d18ed9d1c49ecf6b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "game_question" DROP CONSTRAINT "FK_d35bdfc9ff116d456dcad4a580e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "games" DROP CONSTRAINT "FK_163237722e3676d314c72456873"`,
        );
        await queryRunner.query(
            `ALTER TABLE "games" DROP CONSTRAINT "FK_f9d1d99333703f884ff1d04790e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment_reaction" DROP CONSTRAINT "FK_88bb607240417f03c0592da6824"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment_reaction" DROP CONSTRAINT "FK_92536a1358ea6b6611812f62f3a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "posts" DROP CONSTRAINT "FK_55d9c167993fed3f375391c8e31"`,
        );
        await queryRunner.query(
            `ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "email_confirmation" DROP CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc"`,
        );
        await queryRunner.query(`DROP TABLE "post_reaction"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "game_question"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TABLE "comment_reaction"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "email_confirmation"`);
    }
}
