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

    /**
     *
     * @param userName
     * @param channel
     */
    static getUser(userName, channel) {
        return userList[userName] || new User(userName, channel);
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