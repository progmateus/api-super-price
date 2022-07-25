import { AppError } from "@errors/AppError";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { UpdateUserUseCase } from "../updateUser/UpdateUserUseCase";




let updateUserUseCase: UpdateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let validateProvider: ValidateProvider

describe("Update User useCase", () => {

    beforeEach(() => {
        validateProvider = new ValidateProvider()
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        updateUserUseCase = new UpdateUserUseCase(
            usersRepositoryInMemory,
            validateProvider
        );
    });

    it("Should be able to update a user", async () => {

        const user = {
            name: "john",
            lastname: "doe",
            email: "johndoe@gmail.com",
            password: "john123",
            avatar: "https://image.com"
        }

        await usersRepositoryInMemory.create({
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            avatar: user.avatar
        });

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

        const userUpdate = {
            id: userCreated.id,
            name: "johnny"
        }

        await updateUserUseCase.execute({
            id: userUpdate.id,
            name: userUpdate.name
        })

        const userUpdated = await usersRepositoryInMemory.findByEmail(user.email)

        expect(userUpdated.name).toEqual(userUpdate.name);
    })
})

