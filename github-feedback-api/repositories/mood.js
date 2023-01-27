const DatabaseFactory = require("../providers/database");

class MoodRepository {
    constructor() {
        this.dbProvider = DatabaseFactory.getDatabaseProvider();
        this.tableName = "mood";
    }

    async list() {
        return this.dbProvider.list(this.tableName, {});
    }
}

module.exports = MoodRepository;
