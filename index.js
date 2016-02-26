var irc = require('irc');
var command = require('command');
var bot = new irc.Client('62.210.236.193', 'WIP_QuizzBot', {
    channels: ['#test-quizz']
});

console.log('Connected.');

bot.addListener('message', function (from, to, message) {
    if (message.length > 1 && message.charAt(0) === '!') {
        handleCommand(from, to, message);
    }
});

function handleCommand(from, to, message) {
    var command = message.split(' ')[0];
    console.log(command);
    switch (command) {
        case '!start':
            startCommand(from, to, message);
            break;
        case '!stop':
            stopCommand(from, to, message);
            break;

    }
}

function startCommand(from, to, message) {
    bot.say(to, from + ' requested to start the Quizz !');
    bot.say(to, irc.colors.wrap('light_red', 'Starting Quizz !'));
}

function stopCommand(from, to, message) {

}