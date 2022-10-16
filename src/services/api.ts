import axios from "axios";

const tokenBluesoft = process.env.TOKEN_BLUESOFT_COSMOS;

const api = axios.create({
    baseURL: "https://api.cosmos.bluesoft.com.br",
    headers: { 'X-Cosmos-Token': "DytjRBuVJC5Gmd3dwUZxLA" },
    validateStatus: () => true

})

export async function getProductByGtin(gtin: string) {
    try {
        const { status, data } = await api.get(`gtins/${gtin}`)
        return {
            status: status,
            data: data
        }
    } catch (error) {
        console.log(error);
    }
}