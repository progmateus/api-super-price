import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app"

import createConnection from "@database/index";


let connection: Connection

describe("Create supermarket controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app)
            .post("/users")
            .send({
                name: "username",
                lastname: "userlastname",
                email: "user@email.com",
                password: "user123",
            })
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })


    it("Should be able to find a Supermarket by name", async () => {
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
            .get("/supermarkets/name/")
            .query({
                name: "supermarket test",
            })
            .set({
                authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toEqual("supermarket test");
    })
});