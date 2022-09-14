import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePrices1649544578413 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "prices",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "product_id",
                        type: "uuid",

                    },
                    {
                        name: "supermarket_id",
                        type: "uuid",

                    },
                    {
                        name: "user_id",
                        type: "uuid",

                    },
                    {
                        name: "price",
                        type: "numeric"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKProductPrice",
                        referencedTableName: "products",
                        referencedColumnNames: ["id"],
                        columnNames: ["product_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    },
                    {
                        name: "FKSupermarketPrice",
                        referencedTableName: "supermarkets",
                        referencedColumnNames: ["id"],
                        columnNames: ["supermarket_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    },
                    {
                        name: "FKUserPrice",
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        columnNames: ["user_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]

            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("prices")
    }

}
