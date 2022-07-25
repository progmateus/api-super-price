import request from "supertest";
import createConnection from "@database/index";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";





let connection: Connection;


describe("List products controller", () => {
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


    it("Should be able list All Products", async () => {


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
                name: "product test",
                gtin: "7898940123025",
                brand: "brand test"
            })
            .set({
                authorization: `Bearer ${token}`
            })

        const response = await request(app)
            .get("/products")
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0].name).toEqual("product test");
    })

})