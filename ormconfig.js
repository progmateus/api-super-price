module.exports = {
    "type": "postgres",
    "port": "65432",
    "host": "localhost",
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "migrations": ["src/database/migrations/*.ts"],
    "cli": {
        "migrationsDir": "src/database/migrations"
    },
    "entities": ["./src/modules/**/entities/*.ts"]
}