import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs"
import { AppError } from "@errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";


interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordUserUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,

        @inject("DateProvider")
        private dateProvider: IDateProvider,

        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

    ) { }

    async execute({ token, password }: IRequest): Promise<void> {

        if (!token || !password) {
            throw new AppError("Information missing", 422)
        }

        if (password.length < 6) {
            throw new AppError("password must contain at least 6 characters", 400)
        }

        const userToken = await this.usersTokensRepository.findByRefreshToken(token)

        if (!userToken) {
            throw new AppError("Invalid Token", 401)
        }

        if (this.dateProvider.compareIfBefore(
            userToken.expires_date,
            this.dateProvider.dateNow()
        )) {
            throw new AppError("Token Expired!", 401)
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        user.password = await hash(password, 8);

        await this.usersRepository.update(user);

        await this.usersTokensRepository.deleteById(userToken.id);
    }

}
export { ResetPasswordUserUseCase }