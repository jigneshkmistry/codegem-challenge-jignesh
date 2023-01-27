class DatabaseFactory {
    static getDatabaseProvider() {
        return new KnexProvider();
    }
}

class DatabaseProvider {
    async single(table, id) {
        throw Error("Not implemented");
    }

    async add(table, entity) {
        throw Error("Not implemented");
    }

    async addMany(table, entities) {
        throw Error("Not implemented");
    }
}

class KnexProvider extends DatabaseProvider {
    constructor() {
        super();
        this.client = require("../connections/db_knex");
    }

    async add(table, entity) {
        return this.client(table).returning("id").insert(entity);
    }

    async addMany(table, entities) {
        return this.client.insert(entities, ["id"]).into(table);
    }

    async list(table, whereClause = {}) {
        return this.client.from(table).where(whereClause);
    }

    query(table) {
        return this.client.from(table);
    }
}

module.exports = DatabaseFactory;
