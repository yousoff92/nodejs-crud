
class Item {

    constructor(id, name, description, createdDate, createdBy, updatedDate = null, updatedBy = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdDate = createdDate;
        this.createdBy = createdBy;
    }

}

module.exports = Item;