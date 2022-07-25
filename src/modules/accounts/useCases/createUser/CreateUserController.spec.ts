import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app";

import createConnection from "@database/index";

let connection: Connection;

describe("Create User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })


    it("Should be able to create a new User", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "username",
                lastname: "userlastname",
                email: "user@email.com",
                password: "user123",
            })

        expect(response.status).toBe(201);

    })

    it("Should not be able to create a new User with same email", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "username",
                lastname: "userlastname",
                email: "user@email.com",
                password: "user123",
            })

        expect(response.status).toBe(409);

    })
})