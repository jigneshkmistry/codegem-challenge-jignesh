const {Model} = require("objection");

class MoodModel extends Model {
    static get tableName () {
        return 'mood';
    }
}

module.exports = MoodModel;
