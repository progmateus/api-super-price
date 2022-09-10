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

        if (!isValid) {
            return false
        }

        const gtinValue = gtin.replace("/\D/", "")


        if (gtinValue.length != 13) {
            return false
        }

        const pieceGTIN = gtinValue.substring(0, 12);

        const codeBR = gtinValue.substring(0, 3);

        if (codeBR !== "789") {
            return false
        }

        let soma = 0;
        let lastDigit;

        for (let i = 0; i < pieceGTIN.length; i++) {
            soma += (i % 2 == 0) ? Number(pieceGTIN[i]) : (Number(pieceGTIN[i]) * 3)
        }

        for (let i = 0; i <= 9; i++) {
            if ((soma + i) % 10 == 0) {
                lastDigit = String(i)
            }

        }

        const concat = pieceGTIN.concat(lastDigit)

        return concat === gtin
    }

    async uuidValidateV4(id: string): Promise<boolean> {
        return uuidValidate(id) && uuidVersion(id) === 4;
    }

}
export { ValidateProvider };