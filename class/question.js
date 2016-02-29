"use strict";

const irc = require('irc');
const fz = require('fuzzyset.js');
var id = 0;
var totalAsked = 0;

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
        var self = this;
        self.totalTries++;
        var answers = new fz(self.answers, true, 3, 4);
        console.log(answers.get(message));
        if (answers.get(message) !== null) {
            answers.get(message).forEach(a=> {
                if (a[0] > 0.8) {
                    done(true);
                }
            });
        }
        done(false);
    }

    askQuestion(quizz, to) {
        var self = this;
        self.asked = true;
        totalAsked++;
        console.log(quizz.currentQuestion.answers);
        quizz.ircBot.say(to, irc.colors.wrap('light_magenta', quizz.options.questionTag) + irc.colors.wrap('dark_blue', self.question));
    }

    displayAnswer(quizz, to) {
        var self = this;
        quizz.ircBot.say(to, irc.colors.wrap('light_magenta', quizz.options.answerTag) + irc.colors.wrap('dark_green', self.question));
        quizz.ircBot.say(to, irc.colors.wrap('dark_green', self.answers.join(', ')));
    }

    /**
     * I for now loop trough each question. Removing the element from the array would be faster. //todo
     * @param questionList  {Question[]} - The list of questions
     * @returns {Question} or null if none found
     */
    static getNextQuestion(questionList) {
        var id = Math.floor(Math.random() * (questionList.length));
        console.log(id);
        if (totalAsked < questionList.length) {
            if (!questionList[id].asked) {
                return questionList[id];
            }
            else {
                this.getNextQuestion(questionList);
            }
        }
        else {
            return null;
        }
    }
}

module.exports = Question;