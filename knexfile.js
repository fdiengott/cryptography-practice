/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./api/users.db3",
        },
        migrations: {
            directory: "./api/migrations",
        },
        useNullAsDefault: true,
    },
};
