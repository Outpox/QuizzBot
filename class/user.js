"use strict";

const Database = require('./database.js');

var _db = new Database();

var userList;
_db.getUserlist(list => {
    userList = list;
});

var id = 0;

class User {

    constructor(from, to) {
        this.id = id++;
        this.name = from;
        this.channel = to;
        this.points = 0;
        this.maxContinuous = 0;
        this.answers = 0;
        this.goodAnswers = 0;
        this.quizzStarted = 0;
        userList.users[this.name] = this;
        _db.updateUserlist(userList);
    }

    /**
     *
     * @param userName
     * @param channel
     */
    static getUser(userName, channel) {
        return userList.users[userName] || new User(userName, channel);
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

    static getUserlist() {
        return userList;
    }

    static saveUserlist() {
        _db.updateUserlist(userList);
    }
}

module.exports = User;