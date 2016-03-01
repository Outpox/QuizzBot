"use strict";
const fs = require('fs');
const irc = require('irc');
const i18n = require('i18n');
const Question = require('./question.js');
const User = require('./user.js');
const Error = require('./error.js');
const Database = require('./database.js');

var i = -1;
var _db = new Database();

class QuizzBot {
    /**
     * @param server {String} - Server address
     * @param port {int} - The server port
     * @param ssl {boolean} - Using ssl ?
     * @param botName {String} - The name of the bot
     * @param channels {String[]}- The channels you want the bot to connect to
     * @param questionDatabases {String[]} - The question databases you want to load
     * @param options {Object} - An object of options to set
     */
    constructor(server, port, ssl, botName, channels, questionDatabases, options) {
        options = options || {};
        this.options = options || {};
        this.options.questionDuration = options.questionDuration < 10000 ? 10000 : options.questionDuration || 25000;
        this.options.timeBetweenQuestion = options.timeBetweenQuestion || 10000;
        this.options.timeBeforeTip = (options.timeBeforeTip > this.options.questionDuration ? Math.floor(this.options.questionDuration / 2) : options.timeBeforeTip) || 10000;
        this.options.nickServPassword = options.nickServPassword || null;
        this.options.continuousNoAnswer = options.continuousNoAnswer || 8;

        this.questionFiles = questionDatabases;
        this.running = false;
        this.currentQuestion = null;
        this.currentTotalTimer = null;
        this.currentEndingSoonTimer = null;
        this.nextQuestionTimer = null;
        this.questions = [];
        this.continuousNoAnswerCount = 0;
        this.init(server, port, ssl, botName, channels);
    }

    /**
     * Bot initialization.
     * @param server {String} - Server address
     * @param port {int} - The server port
     * @param ssl {boolean} - Using ssl ?
     * @param botName {String} - The name of the bot
     * @param channels {String[]}- The channels you want the bot to connect to
     */
    init(server, port, ssl, botName, channels) {
        var self = this;
        var options = {
            port: port,
            secure: ssl,
            selfSigned: ssl,
            username: botName,
            realName: 'A QuizzBot made with node-irc',
            channels: channels,
            autoConnect: false
        };
        self.questions = [];
        self.ircBot = new irc.Client(server, botName, options);
        self.ircBot.connect(()=> {
            setTimeout(()=> {
                if (self.options.nickServPassword !== null) {
                    self.ircBot.say('NickServ', 'IDENTIFY ' + self.options.nickServPassword);
                }
                console.log(options.username + ' connected.');
                self.loadQuestions();
                self.standByMessage();
                self.ircBot.addListener('message', (from, to, message) => {
                    var user = User.getUser(from, to);
                    if (from !== botName && message.length > 1 && message.charAt(0) === '!') {
                        self.handleCommand(user, to, message);
                    }
                    else if (self.running && self.currentQuestion !== null && from !== botName && message.length > 1) {
                        self.handleAnswer(user, to, message);
                    }
                });
            }, 500);
        });
    }

    /**
     * Load the questions from the questionFiles parameter
     */
    loadQuestions() {
        var self = this;
        self.questions = [];
        self.questionFiles.forEach((file, i) => {
            var ext = file.substr((~-file.lastIndexOf(".") >>> 0) + 2);
            switch (ext) {
                case 'json':
                    var db = require(file);
                    db.forEach((q) => {
                        var quest = new Question(q);
                        self.questions.push(quest);
                    });
                    break;
                case 'txt':
                    var array = fs.readFileSync(file, 'utf8').toString().split(/\r?\n/);
                    array.forEach(line=> {
                        var splitedLine = line.split('\\');
                        if (splitedLine[1] !== undefined && splitedLine[1].charAt(0) === ' ') {
                            splitedLine[1] = splitedLine[1].substring(1);
                        }
                        self.questions.push(new Question({question: splitedLine[0], answers: [splitedLine[1]]}));
                    });
                    break;
            }
        });
    }

    game(user, to, message) {
        var self = this;
        var nextQuestion = Question.getNextQuestion(self.questions);
        if (nextQuestion !== null && self.continuousNoAnswerCount < self.options.continuousNoAnswer) {
            self.ircBot.say(to, irc.colors.wrap('orange', i18n.__('nextQuestionIn', self.options.timeBetweenQuestion / 1000)));
            self.nextQuestionTimer = setTimeout(() => {
                self.currentQuestion = nextQuestion;
                nextQuestion.askQuestion(self, to);
                self.currentTotalTimer = setTimeout(() => {
                    self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('noGoodAnswer')));
                    self.currentQuestion.displayAnswer(self, to);
                    self.continuousNoAnswerCount++;
                    self.clearGame();
                    User.saveUserlist();
                    self.game(user, to, message);
                }, self.options.questionDuration);

                self.currentEndingSoonTimer = setTimeout(() => {
                    self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('questionEndingIn', self.options.timeBeforeTip / 1000)));
                    self.currentQuestion.displayTip(self, to);
                }, self.options.questionDuration - self.options.timeBeforeTip)

            }, self.options.timeBetweenQuestion);
        }
        else {
            self.stopCommand(null, to, message);
        }
    }

    clearGame() {
        var self = this;
        self.currentQuestion = null;
        clearTimeout(self.currentEndingSoonTimer);
        clearTimeout(self.currentTotalTimer);
    }

    /**
     * Add a question file to the list
     * @param file {String}
     */
    addFile(file) {
        this.questionFiles.push(file);
        this.loadQuestions();
    }

    /**
     * Change the current question files list
     * @param files {String[]}
     */
    changeFiles(files) {
        this.questionFiles = files;
        this.loadQuestions();
    }

    /**
     * Set the bot lang
     * Automatically loads file from the lang/ folder and announce it.
     * @param lang {String} - File name of the lang without js. (ie: en)
     * @param chan optional {String} - If specified, the announce is only made in this chan
     */
    setLang(lang, chan) {
        var self = this;
        i18n.setLocale(lang);
        if (chan) {
            self.ircBot.say(chan, irc.colors.wrap('light_green', i18n.__('langSet')));
        } else {
            self.ircBot.opt.channels.forEach(chan => {
                self.ircBot.say(chan, irc.colors.wrap('light_green', i18n.__('langSet')));
            })
        }
    }

    /**
     * Standby message on every channel the bot is connected to.
     */
    standByMessage() {
        var self = this;
        self.ircBot.opt.channels.forEach(chan => {
            self.ircBot.say(chan, irc.colors.wrap('light_red', i18n.__('standByMessage')));
            self.ircBot.say(chan, irc.colors.wrap('gray', i18n.__('questionInQuizz', self.questions.length)));
            self.ircBot.say(chan, irc.colors.wrap('gray', i18n.__('startCommandMessage')));
        })
    }

    /**
     * The command dispatcher. Call the appropriate function depending on the command.
     * @param user {User} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     */
    handleCommand(user, to, message) {
        var self = this;
        var command = message.split(' ')[0];
        var args = message.split(' ');
        args.shift();
        switch (command) {
            case '!start':
                self.startCommand(user, to, message);
                break;
            case '!stop':
                self.stopCommand(user, to, message);
                break;
            case '!lang':
                self.langCommand(user, to, message, args);
                break;
            case '!say':
                self.sayCommand(user, to, message, args);
                break;
            case '!test':
                self.testCommand(user, to, message, args);
                break;
        }
    }

    /**
     * This is where we check if an answer is good or not.
     * @param user {User} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     */
    handleAnswer(user, to, message) {
        var self = this;
        if (self.currentQuestion !== null) {
            self.currentQuestion.isGoodAnswer(message, good => {
                if (good) {
                    user.incrementPoints();
                    user.plusGoodAnswer();
                    self.ircBot.say(to, i18n.__('goodAnswer', user.name) + ' (' + user.points + ') ! ');
                    self.currentQuestion.displayAnswer(self, to);
                    self.continuousNoAnswerCount = 0;
                    self.clearGame();
                    User.saveUserlist();
                    self.game(user, to, message);
                }
                else {
                    user.plusAnswer();
                }
            })
        }
    }

    /**
     * Announce the beginning of a game a call the main function.
     * @param user {User} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     */
    startCommand(user, to, message) {
        var self = this;
        if (self.running == false) {
            self.running = true;
            self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('requestedStartQuizz', user.name)));
            self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('startingQuizz')));
            user.quizzStarted++;
            self.game(user, to, message);
        }
    }

    /**
     * Stop a game in a progress and announce it.
     * @param user {User} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     */
    stopCommand(user, to, message) {
        var self = this;
        if (self.running) {
            if (user !== null && !user.isOp(self, to)) {
                return false;
            }
            self.running = false;
            self.clearGame();
            clearTimeout(self.nextQuestionTimer);
            if (user) {
                self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('requestedStopQuizz', user.name)));
            }
            self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('stoppingQuizz')));
        }
    }

    /**
     * Handle the lang change + lang help.
     * @param user {User} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     * @param args {String[]} - Pre-parsed args
     */
    langCommand(user, to, message, args) {
        var self = this;
        var langArray = Object.keys(i18n.getCatalog());
        if (args[0] !== undefined && args[0] !== null && args.length > 0) {
            self.setLang(args[0]);
        }
        else {
            var msg = i18n.__('help_lang');
            msg.split('\n').forEach((line) => {
                self.ircBot.say(to, irc.colors.wrap('light_gray', line));
            });
            var langs = "";
            langArray.forEach((lang, i)=> {
                if (i == langArray.length - 1) {
                    langs += lang;
                }
                else {
                    langs += lang + ", ";
                }
            });
            self.ircBot.say(to, irc.colors.wrap('white', langs));
        }
    }

    sayCommand(user, to, message, args) {
        if (user !== null && !user.isOp(self, to)) {
            return false;
        }
        var self = this;
        var msg = args.join(' ');
        self.ircBot.say(to, msg);
    }

    testCommand(user, to, message, args) {
        var self = this;
        if (user !== null && !user.isOp(self, to)) {
            return false;
        }
        console.log(User.getUserlist());
    }
}

module.exports = QuizzBot;