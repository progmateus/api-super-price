import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) { }

    async execute({ user_id, avatar_file }) {
        const user = await this.usersRepository.findById(user_id);

        if (user.avatar) {
            await this.storageProvider.delete(user.avatar)

        }

        await this.storageProvider.save(avatar_file)

        user.avatar = avatar_file;

        await this.usersRepository.update(user);
    }
}
export { UpdateUserAvatarUseCase };