"use strict";

const fs = require('fs');

class Database {
    constructor() {
    }

    /**
     * Save the user to the db. Only used when creating a new user.
     * @param userlist
     */
    static saveUserlist(userlist) {
        fs.writeFile('./data/userlist.json', JSON.stringify(userlist));
    }

    static getUserlist() {
        return require('../data/userlist.json');
    }
}

module.exports = Database;