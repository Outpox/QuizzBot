"use strict";

const irc = require('irc');

var id = 0;

class Question {
    constructor(q) {
        this.id = id++;
        this.question = q.question;
        this.answers = q.answers;
        this.asked = false;
        this.totalTries = 0;
    }

    /**
     * Basic question verification
     * @param message {String} - User answer
     * @param done {Function} - Called when the process is over. Allow to synchronise the process
     */
    isGoodAnswer(message, done) {
        this.answers.forEach((answer) => {
            if (message.toLowerCase() === answer.toLowerCase()) {
                done(true);
            }
        });
        done(false);
    }

    askQuestion(quizz, to) {
        var self = this;
        self.asked = true;
        quizz.ircBot.say(to, irc.colors.wrap('light_magenta', quizz.options.questionTag) + irc.colors.wrap('dark_blue', self.question));
    }

    displayAnswer(quizz, to) {
        var self = this;
        quizz.ircBot.say(to, irc.colors.wrap('light_magenta', quizz.options.answerTag) + irc.colors.wrap('dark_green', self.question));
        quizz.ircBot.say(to, irc.colors.wrap('dark_green', self.answers.join(', ')));
    }
}

module.exports = Question;