"use strict";

const i18n = require('i18n');
const QuizzBot = require('./class/quizzbot.js');

i18n.configure({
    locales: ['fr', 'en'],
    defaultLocale: 'en',
    directory: 'lang/'
});

//vv--------------------vv
//REQUIRED CONFIGURATION//

//Expected: String
var serverAddress = '';

//Expected: Integer
var serverPort = 6697;

//Expected: Boolean
var usingSSL = true;

//Expected: String
var botNick = 'QuizzBot';

//Expected: [String]
var channelList = ['#quizz'];

//Expected: [String] (relative path)
var questionFiles = ['./question/database.txt'];
//^^--------------------^^

//vv--------------------vv
//OPTIONAL CONFIGURATION//
var options = {
    //questionDuration: 25000,
    //timeBetweenQuestion: 15000,
    //timeBeforeTip: 10000,
    //nickServPassword: '',
    //continuousNoAnswer: 8,
};
//^^--------------------^^

new QuizzBot(serverAddress, serverPort, usingSSL, botNick, channelList, questionFiles, options);