import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";


@Entity("users")
class User {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    isAdmin: boolean

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({ name: "avatar_url" })
    avatar_url(): string {
        switch (process.env.disk) {
            case "local":
                return `${process.env.APP_API_URL}/avatar/${this.avatar}`
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`
            default:
                return null

        }
    }

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }

}
export { User };