module.exports = {
    "type": "postgres",
    "port": "5432",
    "host": "localhost",
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "migrations": ["./dist/database/migrations/*.js"],
    "cli": {
        "migrationsDir": "./dist/database/migrations"
    },
    "entities": ["./dist/modules/**/entities/*.js"]
}