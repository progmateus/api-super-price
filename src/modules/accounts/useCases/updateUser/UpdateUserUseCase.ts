import { AppError } from "@errors/AppError";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { compare, hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute({
        id,
        name,
        lastname,
        email,
        password,
        last_password,
    }: IUpdateUserDTO) {
        if (name?.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (lastname?.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (email?.length > 80) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (password?.length > 80) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (last_password?.length > 80) {
            throw new AppError("Character limit exceeded", 400)
        }

        const user = await this.usersRepository.findById(id)

        if (!user) {
            throw new AppError("User does not exists", 404)
        }

        if (name) {
            const nameLowerCase = name.toLowerCase();
            const isValidName = this.validateProvider.validateName(nameLowerCase);
            if (isValidName === false) {
                throw new AppError("Invalid Name!", 400)
            }

            user.name = nameLowerCase;

            await this.usersRepository.update(user)
        }

        if (lastname) {
            const lastnameLowerCase = lastname.toLowerCase();
            const isValidLastname = this.validateProvider.validateName(lastnameLowerCase);
            if (isValidLastname === false) {
                throw new AppError("Invalid Last Name!", 400)
            }

            user.lastname = lastnameLowerCase;

            await this.usersRepository.update(user)
        }


        if (email) {
            const emailLowerCase = email.toLowerCase()

            if (user.email !== emailLowerCase) {


                const isValidEmail = this.validateProvider.ValidateEmail(emailLowerCase);

                if (isValidEmail === false) {
                    throw new AppError("Invalid Email", 400)
                }

                const userAlreadyExists = await this.usersRepository.findByEmail(emailLowerCase);
                if (userAlreadyExists) {
                    throw new AppError("User already exists!", 409)
                }

                user.email = emailLowerCase;

                await this.usersRepository.update(user)

            }
        }

        if (password && last_password) {

            const passwordMatch = await compare(last_password, user.password);

            if (!passwordMatch) {
                throw new AppError("last password incorrect!", 400)
            }

            user.password = await hash(password, 8);

            await this.usersRepository.update(user);
        }

    }

}
export { UpdateUserUseCase }