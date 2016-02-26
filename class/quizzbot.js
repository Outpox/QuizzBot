"use strict";

const irc = require('irc');
const i18n = require('i18n');
const Question = require('./question.js');
const Error = require('./error.js');

class QuizzBot {
    /**
     * @param server {String} - Server address
     * @param port {int} - The server port
     * @param ssl {boolean} - Using ssl ?
     * @param botName {String} - The name of the bot
     * @param channels {String[]}- The channels you want the bot to connect to
     * @param questionDatabases {String[]} - The question databases you want to load
     */
    constructor(server, port, ssl, botName, channels, questionDatabases) {
        this.questionFiles = questionDatabases;
        this.running = false;
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
                console.log(options.username + ' connected.');
                self.loadQuestions();
                self.standByMessage();
                self.ircBot.addListener('message', function (from, to, message) {
                    if (from !== botName && message.length > 1 && message.charAt(0) === '!') {
                        self.handleCommand(from, to, message);
                    }
                })
            }, 50);
        });
    }

    /**
     * Load the questions from the questionFiles parameter
     */
    loadQuestions() {
        var self = this;
        self.questions = [];
        self.questionFiles.forEach((file) => {
            //Right now it's only expected to be a json file. I'll handle .txt file later if ever.
            var db = require(file);
            db.forEach((q) => {
                var quest = new Question(q);
                self.questions.push(quest);
            })
        });
    }

    game() {

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
            self.ircBot.say(chan, irc.colors.wrap('gray', i18n.__('startCommandMessage')));
        })
    }

    /**
     * The command dispatcher. Call the appropriate function depending on the command.
     * @param from {String} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     */
    handleCommand(from, to, message) {
        var self = this;
        var command = message.split(' ')[0];
        var args = message.split(' ');
        args.shift();
        //console.log(command);
        switch (command) {
            case '!start':
                self.startCommand(from, to, message);
                break;
            case '!stop':
                self.stopCommand(from, to, message);
                break;
            case '!lang':
                self.langCommand(from, to, message, args);
                break;
        }
    }

    /**
     * Announce the beginning of a game a call the main function.
     * @param from {String} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     */
    startCommand(from, to, message) {
        var self = this;
        if (self.running == false) {
            self.running = true;
            self.ircBot.say(to, irc.colors.wrap('light_red', from + i18n.__('requestedStartQuizz')));
            self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('startingQuizz')));
        }
    }

    /**
     * Stop a game in a progress and announce it.
     * @param from {String} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     */
    stopCommand(from, to, message) {
        var self = this;
        if (self.running) {
            self.running = false;
            self.ircBot.say(to, irc.colors.wrap('light_red', from + i18n.__('requestedStopQuizz')));
            self.ircBot.say(to, irc.colors.wrap('light_red', i18n.__('stoppingQuizz')));
        }
    }

    /**
     * Handle the lang change + lang help.
     * @param from {String} - User who requested the command
     * @param to {String} - Chan the commands comes from
     * @param message {String} - Command's arguments
     * @param args {String[]} - Pre-parsed args
     */
    langCommand(from, to, message, args) {
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
}

module.exports = QuizzBot;