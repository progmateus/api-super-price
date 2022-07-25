import { AppError } from "@errors/AppError";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DateProvider } from "@shared/container/providers/DateProvider/implementations/DateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;
let dateProvider: DateProvider;
let validateProvider: ValidateProvider;

describe("Send forgot mail useCase", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DateProvider();
        mailProvider = new MailProviderInMemory();
        validateProvider = new ValidateProvider();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider,
            validateProvider
        );
    })

    it("should be able to send a forgot password mail to user", async () => {

        const sendMail = jest.spyOn(mailProvider, "sendMail");

        await usersRepositoryInMemory.create({
            name: "john",
            lastname: "Doe",
            email: "johndoe@gmail.com",
            password: "john123",
        })

        await sendForgotPasswordMailUseCase.execute("johndoe@gmail.com");

        expect(sendMail).toHaveBeenCalled();
    })

    it("should not ble able to send an email if user does not exists", async () => {
        expect(async () => {
            await sendForgotPasswordMailUseCase.execute("false@email.com")
        }).rejects.toEqual(new AppError("User does not exists!", 404))
    })

    it("should be able to create an users token", async () => {
        const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create")

        await usersRepositoryInMemory.create({
            name: "john",
            lastname: "Doe",
            email: "johndoe@gmail.com",
            password: "john123",
        })

        await sendForgotPasswordMailUseCase.execute("johndoe@gmail.com");

        expect(generateTokenMail).toHaveBeenCalled();
    })

})