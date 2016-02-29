"use strict";

const loki = require('lokijs');

var _db;

class Database {
    constructor() {
        _db = new loki('data/quizzbot.db');
    }

    /**
     * Save the user to the db. Only used when creating a new user.
     * @param user {User}
     */
    saveUser(user) {
        _db.loadDatabase({}, () => {
            _db.getCollection('users').insert(user);
            _db.save();
        });
    }

    updateUser(user) {
        _db.loadDatabase({}, () => {
            _db.getCollection('users').update(user);
        });
    }

    getUser(name, channel, done) {
        _db.loadDatabase({}, () => {
            var userCollection = _db.getCollection('users');
            if (!userCollection) {
                userCollection = _db.addCollection('users');
            }
            var results = userCollection.findOne({'$and': [{'name': name}, {'channel': channel}]});
            done(results);
        });
    }
}

module.exports = Database;