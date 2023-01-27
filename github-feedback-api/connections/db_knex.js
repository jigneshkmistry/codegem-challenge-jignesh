const knex = require("knex");
const { types } =  require('pg');
const { builtins } = require('pg-types');

/**
 * The following setup prevents Knex from casting TIMESTAMP and DATE columns to JS Date objects
 */
types.setTypeParser(builtins.DATE, (x) => x);
types.setTypeParser(builtins.TIMESTAMP, (x) => x);

const client = knex({
    client: "pg",
    connection: {
        host: process.env.POSTGRES_HOST || "localhost",
        port: process.env.POSTGRES_PORT || "5432",
        user: process.env.POSTGRES_USER || "codegem",
        password: process.env.POSTGRES_PASSWORD || "codegem",
        database: process.env.POSTGRES_DB || "codegem"
    }
});

module.exports = client;
