"use strict";

const loki = require('lokijs');

class Database {
    constructor() {
        this.database = new loki('data/quizzbot.db');
        console.log(this.database.loadCollection('users'));
        if (this.database.getCollection('users') === null) {
            this.database.addCollection('users');
            this.database.save();
        }
    }

    /**
     * Save the user to the db. Only used when creating a new user.
     * @param user {User}
     */
    saveUser(user) {
        this.database.getCollection('users').insert(user);
        this.database.save();
    }

    updateUser(user) {
        this.database.getCollection('users').update(user);
    }

    getUser(name, channel) {
        console.log(this.database.getCollection('users'));
        console.log(this.database.getCollection('users').find({'$and': [{name: name}, {channel: channel}]}));
    }
}

module.exports = Database;