import upload from "@config/upload";
import { S3 } from "aws-sdk";
import fs from "fs";
import mime from "mime"
import { resolve } from "path"
import { IStorageProvider } from "../IStorageProvider";

class S3StorageProvder implements IStorageProvider {
    private client: S3

    constructor() {
        this.client = new S3({
            region: process.env.AWS_BUCKET_REGION
        })
    }

    async save(file: string): Promise<string> {
        const originalname = resolve(upload.tmpFolder, file)

        const fileContent = await fs.promises.readFile(originalname)

        const ContentType = mime.getType(originalname)

        await this.client.putObject({
            Bucket: `${process.env.AWS_BUCKET}/avatar`,
            Key: file,
            ACL: "public-read",
            Body: fileContent,
            ContentType

        }).promise()

        await fs.promises.unlink(originalname)

        return file
    }

    async delete(file: string): Promise<void> {
        await this.client.deleteObject({
            Bucket: `${process.env.AWS_BUCKET}/avatar`,
            Key: file
        }).promise()
    }


}
export { S3StorageProvder };