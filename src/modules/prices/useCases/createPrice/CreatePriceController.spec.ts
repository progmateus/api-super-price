import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app"
import createConnection from "@database/index";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

let connection: Connection

describe("Create price controller", () => {
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

    it("Should be able to create a price", async () => {

        const responseTokenAdmin = await request(app)
            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const tokenAdmin = responseTokenAdmin.body.token;

        const productResponse = await request(app)
            .post("/products")
            .send({
                name: "product test",
                gtin: "7898940123025",
                brand: "brand test"
            })
            .set({
                authorization: `Bearer ${tokenAdmin}`
            })

        const supermarketResponse = await request(app)
            .post("/supermarkets")
            .send({
                name: "supermarket test",
            })
            .set({
                authorization: `Bearer ${tokenAdmin}`
            })

        const response = await request(app)
            .post("/prices")
            .send({
                supermarket_name: supermarketResponse.body.name,
                gtin: productResponse.body.gtin,
                price: 4.0
            })
            .set({
                authorization: `Bearer ${tokenAdmin}`
            })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.supermarket_id).toEqual(supermarketResponse.body.id);

    })

    it("Should not be able to create a Price with same product and supermarket", async () => {

        const responseTokenAdmin = await request(app)
            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const tokenAdmin = responseTokenAdmin.body.token;

        const productResponse = await request(app)
            .get("/products/7898940123025")
            .set({
                authorization: `Bearer ${tokenAdmin}`
            })

        const supermarketResponse = await request(app)
            .get("/supermarkets/name/")
            .query({
                name: "supermarket test",
            })
            .set({
                authorization: `Bearer ${tokenAdmin}`
            })

        const response = await request(app)
            .post("/prices")
            .send({
                supermarket_name: supermarketResponse.body.name,
                gtin: productResponse.body.gtin,
                price: 4.0
            })
            .set({
                authorization: `Bearer ${tokenAdmin}`
            })
        expect(response.status).toBe(409);
    })
})