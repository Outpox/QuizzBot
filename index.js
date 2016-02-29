"use strict";

const i18n = require('i18n');
const QuizzBot = require('./class/quizzbot.js');
const db = require('lokijs');

i18n.configure({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    directory: 'lang/'
});

var options = {
    timeBetweenQuestion: 15000,
    nickServPassword: 'quizzbot'
};

//new QuizzBot('62.210.236.193', 6697, true, 'WIP_QuizzBot', ['#test-quizz'], ['../questions/airfrance.json'], {timeBetweenQuestion: 5000});
new QuizzBot('62.210.236.193', 6697, true, 'WIP_QuizzBot', ['#quizz'], ['./questions/database.txt'], options);