import { Connection, createConnection, getConnectionOptions } from "typeorm"

export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions()
    return createConnection(
        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === "test"
                ? "super_price_test"
                : defaultOptions.database
        })
    )
}