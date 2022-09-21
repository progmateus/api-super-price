interface IValidateProvider {
    validateName(name: string): boolean;
    ValidateEmail(email: string): boolean;
    validateGtin(gtin: string): boolean;
    uuidValidateV4(id: string): Promise<boolean>;
    validateSupermarketName(name: string): Promise<boolean>;
}

export { IValidateProvider }