"use strict";

const loki = require('lokijs');

var _db;

class Database {
    constructor() {
        _db = new loki('data/quizzbot.db');
    }

    /**
     * Save the user to the db. Only used when creating a new user.
     * @param userlist
     */
    save() {
        _db.loadDatabase({}, () => {
            _db.save();
        });
    }

    updateUserlist(userlist) {
        _db.loadDatabase({}, () => {
            _db.getCollection('userlist').update(userlist);
            _db.save();
        });
    }

    getUserlist(done) {
        _db.loadDatabase({}, () => {
            var userlistCollection = _db.getCollection('userlist');
            if (!userlistCollection) {
                userlistCollection = _db.addCollection('userlist');
            }
            var results = userlistCollection.findOne({'id': 0});
            if (results === null) {
                var ul = {'id': 0, users: []};
                userlistCollection.insert(ul);
                results = ul;
                _db.save();
            }
            done(results);
        });
    }
}

module.exports = Database;