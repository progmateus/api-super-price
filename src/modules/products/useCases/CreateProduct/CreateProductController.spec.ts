import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app"
import { v4 as uuidV4 } from "uuid";

import createConnection from "@database/index";
import { hash } from "bcryptjs";


let connection: Connection

describe("Create product controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        /* const user = await request(app)
             .post("/users")
             .send({
                 name: "username",
                 lastname: "userlastname",
                 email: "user@email.com",
                 password: "user123",
             }) */

        const id = uuidV4();
        const password = await hash("admin123", 8)


        await connection.query(
            `INSERT INTO USERS(id, name, lastname,"isAdmin", email, password, avatar, created_at, updated_at)
            values('${id}', 'jon', 'doe', true, 'admin@gmail.com', '${password}', 'linkImage', 'now()', 'now()')
            `
        )
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })


    it("Should be able to create a new product", async () => {
        const responseToken = await request(app)

            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const { token } = responseToken.body;

        const response = await request(app)
            .post("/products")
            .send({
                name: "product test",
                gtin: "7898940123025",
                brand: "brand test"
            })
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(201);
    })

    it("Should be able to create a new product with same Gtin", async () => {
        const responseToken = await request(app)

            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const { token } = responseToken.body;

        const response = await request(app)
            .post("/products")
            .send({
                name: "product test",
                gtin: "7898940123025",
                brand: "brand test"
            })
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(409);
    })

});