import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app"
import { v4 as uuidV4 } from "uuid";

import createConnection from "@database/index";
import { hash } from "bcryptjs";


let connection: Connection

describe("Delete product controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

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


    it("Should be able to delete a product", async () => {


        const product = {
            name: "product test",
            gtin: "7898940123025",
            brand: "brand test"
        }

        const responseToken = await request(app)

            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const { token } = responseToken.body;

        await request(app)
            .post("/products")
            .send({
                name: product.name,
                gtin: product.gtin,
                brand: product.brand
            })
            .set({
                authorization: `Bearer ${token}`
            })

        const productResponse = await request(app)
            .get(`/products/${product.gtin}`)
            .set({
                authorization: `Bearer ${token}`
            })


        const response = await request(app)
            .delete(`/products/${productResponse.body.id}`)
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(204);
    })

    it("should not be able to delete a non-existing price", async () => {

        const uuid = uuidV4();

        const responseToken = await request(app)

            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const { token } = responseToken.body;


        const response = await request(app)
            .delete(`/products/${uuid}`)
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(404);
    })
});