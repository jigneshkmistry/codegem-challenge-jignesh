const DatabaseFactory = require("../providers/database");

class TagRepository {
    constructor() {
        this.dbProvider = DatabaseFactory.getDatabaseProvider();
        this.tableName = "tag";
    }

    async list() {
        return this.dbProvider.list(this.tableName, {});
    }
}

module.exports = TagRepository;
