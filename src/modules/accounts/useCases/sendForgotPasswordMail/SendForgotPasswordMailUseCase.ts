import { AppError } from "@errors/AppError";
import { v4 as uuidV4 } from "uuid"
import { resolve } from "path";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { inject, injectable } from "tsyringe";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { template } from "handlebars";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";



@injectable()
class SendForgotPasswordMailUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,

        @inject("DateProvider")
        private dateProvider: IDateProvider,

        @inject("EtherealMailProvider")
        private mailProvider: IMailProvider,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider

    ) { }

    async execute(email: string) {

        if (email.length > 80) {
            throw new AppError("Character limit exceeded", 400)
        }

        const emailLoweCase = email.toLocaleLowerCase()

        const isValidEmail = this.validateProvider.ValidateEmail(emailLoweCase)

        if (isValidEmail === false) {
            throw new AppError("Invalid email", 400)
        }

        const templatePath = resolve(
            __dirname,
            "..",
            "..",
            "views",
            "emails",
            "forgotPassword.hbs"
        )

        const user = await this.usersRepository.findByEmail(emailLoweCase);

        if (!user) {
            throw new AppError("User does not exists!", 404)
        }

        const token = uuidV4();

        const expires_date = this.dateProvider.addHours(3)

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date
        })

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`
        }

        await this.mailProvider.sendMail(
            emailLoweCase,
            "Recuperação de senha",
            variables,
            templatePath
        )

    }

}
export { SendForgotPasswordMailUseCase };