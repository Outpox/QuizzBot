"use strict";

const i18n = require('i18n'),
      config = require('./config'),
      QuizzBot = require('./class/quizzbot.js');

let {lang, serverAddress, serverPort, usingSSL, botNick, channelList, questionFiles, options} = config;

i18n.configure({
    locales: ['fr', 'en'],
    defaultLocale: lang,
    directory: 'lang/'
});

new QuizzBot(serverAddress, serverPort, usingSSL, botNick, channelList, questionFiles, options);