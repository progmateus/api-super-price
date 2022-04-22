import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app";

import createConnection from "@database/index";
import { AppError } from "@errors/AppError";

let connection: Connection;

describe("Update User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })


    it("Should be able to update a User", async () => {

        const user = {
            name: "username",
            lastname: "userlastname",
            email: "user@email.com",
            password: "user123",
        }

        await request(app)
            .post("/users")
            .send({
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
            })

        const responseToken = await request(app)

            .post('/sessions')
            .send({
                email: user.email,
                password: user.password
            })

        const { refresh_token } = responseToken.body;

        const userUpdate = {
            name: "test",
        }

        const response = await request(app)
            .put("/users/edit")
            .send({
                name: userUpdate.name
            })
            .set({
                authorization: `Bearer ${refresh_token}`
            })


        expect(response.status).toBe(200);

    })


    it("Should not be able update more then one information", async () => {

        const user = {
            name: "username",
            lastname: "userlastname",
            email: "user@email.com",
            password: "user123",
        }

        await request(app)
            .post("/users")
            .send({
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
            })

        const responseToken = await request(app)

            .post('/sessions')
            .send({
                email: user.email,
                password: user.password
            })

        const { refresh_token } = responseToken.body;

        const userUpdate = {
            name: "john",
            lastname: "doe"
        }

        const response = await request(app)
            .put("/users/edit")
            .send({
                name: userUpdate.name,
                lastname: userUpdate.lastname
            })
            .set({
                authorization: `Bearer ${refresh_token}`
            })

        expect(response.status).toBe(400);

    })
})