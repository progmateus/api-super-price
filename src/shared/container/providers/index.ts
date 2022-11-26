import { container } from "tsyringe";
import { IDateProvider } from "./DateProvider/IDateProvider";
import { DateProvider } from "./DateProvider/implementations/DateProvider";
import { IMailProvider } from "./MailProvider/IMailProvider";
import { EtherealMailProvider } from "./MailProvider/implementations/EtherealMailProvider";
import { LocalStorageProvider } from "./StorageProvider/implementations/LocalStorageProvider";
import { S3StorageProvder } from "./StorageProvider/implementations/S3StorageProvider";
import { IStorageProvider } from "./StorageProvider/IStorageProvider";
import { ValidateProvider } from "./ValidateProvider/implementations/ValidateProvider";
import { IValidateProvider } from "./ValidateProvider/IValidateProvider";

container.registerSingleton<IValidateProvider>(
    "ValidateProvider",
    ValidateProvider
)

container.registerSingleton<IDateProvider>(
    "DateProvider",
    DateProvider
)

container.registerInstance<IMailProvider>(
    "EtherealMailProvider",
    new EtherealMailProvider()
)

const diskStorage = {
    local: LocalStorageProvider,
    s3: S3StorageProvder
}

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    diskStorage[process.env.disk]
)