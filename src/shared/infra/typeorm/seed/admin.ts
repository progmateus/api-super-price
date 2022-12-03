import createConnection from "@database/index";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";


async function create() {
    const connection = await createConnection()
    const id = uuidV4();
    const password = await hash(process.env.PASSWORD_SEED_ADMIN, 8)

    await connection.query(
        `INSERT INTO USERS(id, name, lastname, email, password, avatar, created_at, updated_at, "isAdmin")
        VALUES ('${id}', 'admin', 'master', '${process.env.EMAIL_SEED_ADMIN}', '${password}', 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197', 'now()', 'now()', 'true')
        `
    )
    await connection.close();
}

create().then(() => console.log("User Admin Created!"))