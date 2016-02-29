"use strict";

const database = require('./database.js');

var userList = {};
var id = 0;

class User {

    constructor(from, to) {
        var loadedDb = new database();

        this.id = id++;
        this.name = from;
        this.channel = to;
        this.points = 0;
        this.maxContinuous = 0;
        this.answers = 0;
        this.goodAnswers = 0;
        loadedDb.saveUser(this);
    }

    /**
     *
     * @param userName
     * @param channel
     * @returns {*|User}
     */
    static getUser(userName, channel) {
        var self = this;
        var loadedDb = new database();
        var user = loadedDb.getUser(userName, channel);
        if (!user) user = new User(userName, channel);
        console.log(user);
        return user;
    }

    incrementPoints() {
        this.points++;
    }

    plusGoodAnswer() {
        this.goodAnswers++;
    }

    plusAnswer() {
        this.answers++;
    }

    isOp(quizz, chan) {
        var self = this;
        return quizz.ircBot.chans[chan].users[self.name].indexOf('@') !== -1;
    }

    update() {
        var self = this;
        var loadedDb = new database();
        loadedDb.updateUser(self);
    }
}

module.exports = User;