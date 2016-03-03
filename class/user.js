"use strict";

const Database = require('./database.js');

var userlist = {};

var id = 0;

class User {

    constructor(from, to, user) {
        this.id = id++;
        this.name = from;
        this.channel = to;
        this.points = 0;
        this.maxContinuous = 0;
        this.answers = 0;
        this.goodAnswers = 0;
        this.quizzStarted = 0;
        this.quizzStopped = 0;
        if (user) {
            for (var prop in user) {
                this[prop] = user[prop];
            }
        }
        userlist[this.name] = this;
        if (!user) {
            Database.saveUserlist(userlist);
        }
    }

    /**
     *
     * @param userName
     * @param channel
     */
    static getUser(userName, channel) {
        return userlist[userName] || new User(userName, channel);
    }

    incrementPoints() {
        this.points++;
    }

    plusGoodAnswer() {
        this.answers++;
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
        return userlist;
    }

    static saveUserlist() {
        Database.saveUserlist(userlist);
    }
}

var ul = Database.getUserlist();
for (var user in ul) {
    new User('', '', ul[user]);
}

module.exports = User;