"use strict";

const Database = require('./database.js');

var userlist = {};

var id = 0;

class User {

    constructor(from, to, loadUser) {
        if (loadUser) {
            this.id = loadUser.id;
            this.name = loadUser.name;
            this.channel = loadUser.channel;
            this.points = loadUser.points;
            this.maxContinuous = loadUser.maxContinuous;
            this.answers = loadUser.answers;
            this.goodAnswers = loadUser.goodAnswers;
            this.quizzStarted = loadUser.quizzStarted;
            userlist[this.name] = this;
        }
        else {
            this.id = id++;
            this.name = from;
            this.channel = to;
            this.points = 0;
            this.maxContinuous = 0;
            this.answers = 0;
            this.goodAnswers = 0;
            this.quizzStarted = 0;
            userlist[this.name] = this;
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

Object.keys(Database.getUserlist()).forEach(user => {
    new User('', '', userlist[user]);
    console.log(user);
});

module.exports = User;