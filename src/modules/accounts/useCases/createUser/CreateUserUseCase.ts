import { inject, injectable } from "tsyringe";
import { AppError } from "@errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { hash } from "bcryptjs"
@injectable()
class CreateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute({
        name,
        lastname,
        email,
        password,
    }: ICreateUserDTO) {

        if (name.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (lastname.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (email.length > 80) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (password.length > 80) {
            throw new AppError("Character limit exceeded", 400)
        }

        const nameLowerCase = name.toLowerCase();
        const isValidName = this.validateProvider.validateName(nameLowerCase);
        if (isValidName === false) {
            throw new AppError("Invalid Name!", 400)
        }

        const lastnameLowerCase = lastname.toLowerCase();
        const isValidLastname = this.validateProvider.validateName(lastnameLowerCase);
        if (isValidLastname === false) {
            throw new AppError("Invalid Last Name!", 400)
        }

        const emailLoweCase = email.toLowerCase()
        const isValidEmail = this.validateProvider.ValidateEmail(emailLoweCase);
        if (isValidEmail === false) {
            throw new AppError("Invalid Email", 400)
        }

        if (password.length < 6) {
            throw new AppError("password must contain at least 6 characters", 400)
        }

        const user = await this.usersRepository.findByEmail(emailLoweCase);
        if (user) {
            throw new AppError("User already exists!", 409)
        }

        const passwordHash = await hash(password, 8)

        await this.usersRepository.create({
            name: nameLowerCase,
            lastname: lastnameLowerCase,
            email: emailLoweCase,
            password: passwordHash
        })




    }
}
export { CreateUserUseCase };