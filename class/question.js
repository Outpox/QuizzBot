"use strict";

class Question {
    constructor(q) {
        this.question = q.question;
        this.answers = q.answers;
    }

    /**
     * Basic question verificaton
     * @param message {String} - User answer
     * @returns {boolean} - If the user answer was good or not
     */
    isGoodAnswer(message) {
        this.answers.forEach((answer) => {
            if (message == answer) {
                return true
            }
        });
        return false;
    }
}

module.exports = Question;