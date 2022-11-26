import { instanceToInstance } from "class-transformer"
import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { User } from "../infra/typeorm/entities/User";

class userMap {
    static toDTO({
        id,
        name,
        lastname,
        email,
        avatar,
        avatar_url

    }: User): IUserResponseDTO {
        const user = instanceToInstance({
            id,
            name,
            lastname,
            email,
            avatar,
            avatar_url
        })

        return user
    }
}

export { userMap };