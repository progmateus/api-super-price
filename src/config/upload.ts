import multer from "multer"
import crypto from "crypto";
import { resolve } from "path";
import { AppError } from "@errors/AppError";

export default {

    upload(folder: string) {
        return {
            storage: multer.diskStorage({
                destination: resolve(__dirname, "..", "..", folder),

                filename: (request, file, callback) => {

                    const fileHash = crypto.randomBytes(16).toString("hex");
                    const filename = `${fileHash}-${file.originalname}`


                    return callback(null, filename)
                },


            }),

            fileFilter: (request, file, callback) => {

                const allowedMimes = [
                    "image/jpg",
                    "image/jpeg",
                    "image/pjpeg",
                    "image/png",
                ]

                if (allowedMimes.includes(file.mimetype)) {
                    callback(null, true)
                } else {
                    callback(new AppError("Invalid file type.", 415))
                }

            }
        }
    }
}