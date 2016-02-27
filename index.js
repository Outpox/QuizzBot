"use strict";

const i18n = require('i18n');
const QuizzBot = require('./class/quizzbot.js');

i18n.configure({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    directory: 'lang/'
});

new QuizzBot('62.210.236.193', 6697, true, 'WIP_QuizzBot', ['#test-quizz'], ['../questions/airfrance.json'], {timeBetweenQuestion: 5000});