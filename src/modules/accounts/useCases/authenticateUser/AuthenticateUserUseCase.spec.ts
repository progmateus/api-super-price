import { AppError } from "@errors/AppError";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DateProvider } from "@shared/container/providers/DateProvider/implementations/DateProvider";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";




let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DateProvider;
let createUserUseCase: CreateUserUseCase;
let validateProvider: ValidateProvider


describe("Authenticate user useCase", () => {

    beforeAll(() => {
        process.env.SECRET_TOKEN = "secrettoken";
        process.env.SECRET_REFRESH_TOKEN = "secretrefreshtoken";

    })

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        validateProvider = new ValidateProvider();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            validateProvider,
            usersTokensRepositoryInMemory,
            dateProvider
        );
        createUserUseCase = new CreateUserUseCase(
            usersRepositoryInMemory,
            validateProvider
        );
    })

    it("should ble able to authenticate a user", async () => {
        const user = {
            name: "John",
            lastname: "Doe",
            email: "johndoe@gmail.com",
            password: "john123",
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");
    })


    it("should not to be able to authenticate an nonexistent user", async () => {


        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "1234"
            });

        }).rejects.toEqual(new AppError("Email or password incorrect!", 401))
    })


    it("should not be able to authenticate with incorrect password", async () => {
        const user = {
            name: "John",
            lastname: "Doe",
            email: "johndoe@gmail.com",
            password: "john123",
        }

        await createUserUseCase.execute(user);

        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "1234"
            });
        }).rejects.toEqual(new AppError("Email or password incorrect!", 401))
    })
})



