import { Router } from "express";
import uploadConfig from "@config/upload"
import multer from "multer";
import { CreateUserController } from "@modules/accounts/useCases/createUser/CreateUserController";
import { UpdateUserController } from "@modules/accounts/useCases/updateUser/UpdateUserController";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";
import { UpdateUserAvatarController } from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController";
import { FindUserByEmailController } from "@modules/accounts/useCases/findUserByEmail/FindUserByEmailController";
import { ProfileUserController } from "@modules/accounts/useCases/profileUser/ProfileUserController";

const uploadAvatar = multer(uploadConfig)
const usersRoutes = Router();
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController
const uploadUserAvatarController = new UpdateUserAvatarController();
const findUserByEmailController = new FindUserByEmailController();
const profileUserController = new ProfileUserController();

usersRoutes.post("/", createUserController.handle);
usersRoutes.put("/", ensureAuthenticated, updateUserController.handle);
usersRoutes.get("/email", findUserByEmailController.handle);
usersRoutes.patch(
    "/avatar",
    ensureAuthenticated,
    uploadAvatar.single("avatar"),
    uploadUserAvatarController.handle);


usersRoutes.get("/profile", ensureAuthenticated, profileUserController.handle);


export { usersRoutes };

