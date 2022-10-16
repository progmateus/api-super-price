import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";
import sharp from "sharp";
import fs from "fs"
import path from "path"


class UpdateUserAvatarController {



    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const avatar_file = request.file.filename;
        const { filename: image } = request.file

        const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);

        await updateUserAvatarUseCase.execute({
            user_id: id,
            avatar_file
        })

        return response.status(204).send();
    }
}
export { UpdateUserAvatarController };