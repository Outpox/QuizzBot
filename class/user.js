"use strict";

var userList = {};
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
        userList[this.name] = this;
    }

    static getUser(from, to) {
        return userList[from] || new User(from, to);
        //userList.forEach(user => {
        //    if (from === user.name && to === user.channel) {
        //        done(user);
        //    }
        //});
        //done(new User(from, to));
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
}

module.exports = User;