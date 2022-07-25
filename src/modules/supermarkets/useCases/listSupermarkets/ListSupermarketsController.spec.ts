import request from "supertest";
import createConnection from "@database/index";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app";

let connection: Connection;


describe("List supermarkets controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })


    it("Should be able list All Supermarkets", async () => {

        await request(app)
            .post("/users")
            .send({
                name: "username",
                lastname: "userlastname",
                email: "user@email.com",
                password: "user123",
            })

        const responseToken = await request(app)
            .post('/sessions')
            .send({
                email: "user@email.com",
                password: "user123"
            })

        const { token } = responseToken.body;

        await request(app)
            .post("/supermarkets")
            .send({
                name: "supermarket test",
            })
            .set({
                authorization: `Bearer ${token}`
            })

        const response = await request(app)
            .get("/supermarkets")
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0].name).toEqual("supermarket test");
    })

})