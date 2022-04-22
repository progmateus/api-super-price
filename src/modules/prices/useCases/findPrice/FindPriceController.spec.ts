import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app"
import createConnection from "@database/index";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";


let connection: Connection


describe("Find price controller", () => {
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



    it("Should be able to find a price", async () => {

        const responseTokenAdmin = await request(app)
            .post('/sessions')
            .send({
                email: "admin@gmail.com",
                password: "admin123"
            })

        const tokenAdmin = responseTokenAdmin.body.refresh_token;

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

        const price = await request(app)
            .post("/prices")
            .send({
                supermarket_id: supermarketResponse.body.id,
                product_id: productResponse.body.id,
                price: 4.0
            })
            .set({
                authorization: `Bearer ${tokenAdmin}`
            })


        const user = await request(app)
            .post("/users")
            .send({
                name: "username",
                lastname: "userlastname",
                email: "user@email.com",
                password: "user123",
            })

        const responseTokenUser = await request(app)

            .post('/sessions')
            .send({
                email: "user@email.com",
                password: "user123"
            })

        const tokenUser = responseTokenUser.body.refresh_token;


        const response = await request(app)
            .get("/prices/find/")
            .query({
                supermarket_name: "supermarket test",
                gtin: "7898940123025"
            })
            .set({
                authorization: `Bearer ${tokenUser}`
            })


        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0].supermarket_id).toEqual(supermarketResponse.body.id);

    })
})