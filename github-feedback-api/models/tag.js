const {Model} = require("objection");

class TagModel extends Model {
    static get tableName () {
        return 'tag';
    }
}

module.exports = TagModel;
