"use strict";

const irc = require('irc');
const fz = require('fuzzyset.js');
const i18n = require('i18n');

var id = 0;
var totalAsked = 0;

function setCharAt(str, index, char) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + char + str.substr(index + 1);
}

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
        console.log('[' + (self.id + 1) + '] ' + quizz.currentQuestion.answers);
        quizz.ircBot.say(to, irc.colors.wrap('light_magenta', i18n.__('questionTag')) + irc.colors.wrap('dark_blue', self.question));
    }

    displayAnswer(quizz, to) {
        var self = this;
        //quizz.ircBot.say(to, irc.colors.wrap('light_magenta', i18n.__('answerTag')) + irc.colors.wrap('dark_green', self.question));
        quizz.ircBot.say(to, irc.colors.wrap('light_magenta', i18n.__('answerTag')) + irc.colors.wrap('dark_green', self.answers.join(', ')));
    }

    displayTip(quizz, to) {
        var self = this;
        var id = Math.floor(Math.random() * (self.answers.length));
        var answer = self.answers[id];
        var tip = '';
        answer.split(' ').forEach(word => {
            var wordTip = '';
            var i;
            for (i = 0; i < word.length; i++) {
                wordTip += '_';
            }
            if (word.length > 3) {
                var letters = Math.floor(word.length / 3);
                for (i = 0; i < letters; i++) {
                    var place = Math.floor(Math.random() * (word.length));
                    while (wordTip.charAt(place) !== '_') {
                        place = Math.floor(Math.random() * (word.length));
                    }
                    wordTip = setCharAt(wordTip, place, word.charAt(place));
                }
            }
            tip += wordTip + ' ';
        });
        quizz.ircBot.say(to, irc.colors.wrap('light_magenta', i18n.__('tipTag')) + irc.colors.wrap('light_gray', tip));
    }

    /**
     * I for now loop trough each question. Removing the element from the array would be faster. //todo
     * @param questionList  {Question[]} - The list of questions
     * @returns {Question} or null if none found
     */
    static getNextQuestion(questionList) {
        var id = Math.floor(Math.random() * (questionList.length));
        if (totalAsked < questionList.length) {
            if (!questionList[id].asked) {
                return questionList[id];
            }
            else {
                return this.getNextQuestion(questionList);
            }
        }
        else {
            return null;
        }
    }
}

module.exports = Question;