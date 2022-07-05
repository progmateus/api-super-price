import { injectable } from "tsyringe";
import { IValidateProvider } from "../IValidateProvider";
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

@injectable()
class ValidateProvider implements IValidateProvider {

    validateName(name: string): boolean {

        const regex = /^[a-záàâãéèêíïóôõöúçñ]+$/i

        const isValid = regex.test(name);

        return isValid
    }

    ValidateEmail(email: string): boolean {

        /* const isValidEmail =  isEmail(email)

            if(isValidEmail === false){
                return false
            } */


        const emailRegex = /^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
        const validateEmail = emailRegex.test(email);

        // const validateEmailExec = emailRegex.exec(email)

        // if (validateEmailExec === null) {
        //     return false
        // }

        // if (validateEmailExec.index === 0) {
        //     return true
        // }

        // if (validateEmailExec.index !== 0) {
        //     return false
        // }

        const badCharactersRegex = /[!#$%&'*()+`{|}~]/g;
        const validEmail = badCharactersRegex.test(email);
        if (validEmail === true) {
            return false
        }


        return validateEmail;
    }

    validateGtin(gtin: string): boolean {

        const regex = /^[0-9]+$/g

        const isValid = regex.test(gtin);
        return isValid;
    }

    async uuidValidateV4(id: string): Promise<boolean> {
        return uuidValidate(id) && uuidVersion(id) === 4;
    }

}
export { ValidateProvider };