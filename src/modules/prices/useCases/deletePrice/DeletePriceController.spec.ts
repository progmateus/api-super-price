import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app"
import { v4 as uuidV4 } from "uuid";

import createConnection from "@database/index";
import { hash } from "bcryptjs";


let connection: Connection

describe("Delete price controller", () => {

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


    it("Should be able to delete a price", async () => {

        const responseToken = await request(app)
            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const { token } = responseToken.body;

        const product = {
            name: "product test",
            gtin: "7898940123025",
            brand: "brand test"
        }

        ///create a product
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


        ///create a supermarket
        await request(app)
            .post("/supermarkets")
            .send({
                name: "supermarket test",
            })
            .set({
                authorization: `Bearer ${token}`
            })


        ///create a price
        await request(app)
            .post("/prices")
            .send({
                supermarket_name: "supermarket test",
                gtin: product.gtin,
                price: 4.0
            })
            .set({
                authorization: `Bearer ${token}`
            })


        ///find a price
        const priceResponse = await request(app)
            .get("/prices")
            .query({
                supermarket_name: "supermarket test",
                gtin: product.gtin
            })
            .set({
                authorization: `Bearer ${token}`
            })


        const response = await request(app)
            .delete(`/prices/${priceResponse.body[0].price.id}`)
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(204);
    })
});