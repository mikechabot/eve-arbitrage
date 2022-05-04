import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1651694209781 implements MigrationInterface {
    name = 'CreateTables1651694209781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "InvType" ("id" SERIAL NOT NULL, "typeId" integer NOT NULL, "groupId" integer NOT NULL, "typeName" character varying NOT NULL, "volume" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_57d29c1dfdefd66bae3fd7378bf" UNIQUE ("typeId"), CONSTRAINT "PK_fdf5e565eb5b9aa525f9d2b70de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "InvGroup" ("id" SERIAL NOT NULL, "groupId" integer NOT NULL, "categoryId" integer NOT NULL, "groupName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9473f1301ea672ad29113aa01d9" UNIQUE ("groupId"), CONSTRAINT "PK_13154f6713eb22f6bd4aad43c6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "InvCategory" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "categoryName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1b518adbb2373c9c53a8f4b2a5f" UNIQUE ("categoryId"), CONSTRAINT "PK_8f77261ef4c7096a91abc209972" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Station" ("id" SERIAL NOT NULL, "stationId" integer NOT NULL, "security" real NOT NULL, "stationName" character varying NOT NULL, "isNpc" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9ffa06e1b2f77ff867cf35e021" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "OAuthToken" ("id" SERIAL NOT NULL, "characterId" integer NOT NULL, "access_token" character varying NOT NULL, "token_type" character varying NOT NULL, "refresh_token" character varying NOT NULL, "expires_in" integer NOT NULL, "isValid" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4cd5f3d29cd2b2563e77b30d5af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Structure" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ownerId" integer NOT NULL, "solarSystemId" integer NOT NULL, "typeId" integer, "locationId" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_79df5be7db5e4d8776ff9987eeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "InvType" ADD CONSTRAINT "FK_4b012739987af80e09f96cdc797" FOREIGN KEY ("groupId") REFERENCES "InvGroup"("groupId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "InvGroup" ADD CONSTRAINT "FK_387bca74d1d42e3c282af6be351" FOREIGN KEY ("categoryId") REFERENCES "InvCategory"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "InvGroup" DROP CONSTRAINT "FK_387bca74d1d42e3c282af6be351"`);
        await queryRunner.query(`ALTER TABLE "InvType" DROP CONSTRAINT "FK_4b012739987af80e09f96cdc797"`);
        await queryRunner.query(`DROP TABLE "Structure"`);
        await queryRunner.query(`DROP TABLE "OAuthToken"`);
        await queryRunner.query(`DROP TABLE "Station"`);
        await queryRunner.query(`DROP TABLE "InvCategory"`);
        await queryRunner.query(`DROP TABLE "InvGroup"`);
        await queryRunner.query(`DROP TABLE "InvType"`);
    }

}
