import axios from "axios";

const api = axios.create({
    baseURL: "https://api.cosmos.bluesoft.com.br",
    headers: { 'X-Cosmos-Token': "ZRoQUFF16c3ZY-hsXqWJ8Q" },
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