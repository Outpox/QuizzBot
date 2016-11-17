#IRC QuizzBot  

This is a quizz bot for IRC made with NodeJS.

* Easy to use
* Supports several languages (english and french at the moment)
* Supports questions with multiple answers
* Easily customizable
* Run in CLI  

It currently only handles one channel at a time, but will support more if I have time.

###How to use
Clone the repo: `git clone https://github.com/Outpox/QuizzBot.git`.  
Go in the cloned directory `cd QuizzBot` and then run `npm install` to install the dependencies.  
Edit index.js to configure the bot. See [#Customization](#customization).  
Run the bot with `node index.js`.  
I suggest you to run it in a `screen`.

###Customization
**Required configuration:**
 
* Server's address
* Server port
* Using SSL ?
* Bot's name
* Channels to connect to
* Questions files

Edit the file `config.json` with whatever text editor you want.

**Optional configuration:**
The default values are already set in the file.

* questionDuration : Question duration (in ms)
* timeBetweenQuestion: Time between each question (in ms)
* timeBeforeTip: Time before tip is displayed (in ms)
* nickServPassword: Nickserv password (if your server uses nickserv and your bot name is registered, setting this will authenticate the bot on log in)
* continuousNoAnswer: Amount of unanswered questions before the bot stops itself 

###Available commands
* `!help`  
Display the help. Each command has its own help that you can access using `!help cmd`.
* `!start`  
Start a quizz.
* `!stop`  
Stop a quizz, requires to be OP. (Planned to allow the user who started the quizz to stop it as well).
* `!ask`  
Ask a specific question by its ID. Requires to be OP.
* `!top`  
If the user is OP, the top is displayed in the channel. If not it is sent trough PM to the user.  
This command accept one optional parameter which is the amount of user to display.
* `!stats`  
Display a user stats (more informations than top). Might be deprecated.
This command accept one optional parameter which is a user name to get stats from.
* `!lang`  
Changes the bot language for the current session. Requires to be OP.

###Answers
I'm using [fuzzyset.js](http://glench.github.io/fuzzyset.js/) to determine if the given answer is good or not. It is configured to allow small mistakes.  
This means that if an user answers `Mikhael Jackson` when the expected answer is `Michael Jackson` it will still be accepted.  
If no good answer is given, a random tip is displayed. Some letters of the first (if there are many) answer are shown while the remaining is replaced with underscores `_`.  
If the answer is `Spongebob`, a tip could be `S____e___`.  
There are (word's length)/3 floored letters displayed.

###Questions files
Two formats are accepted, the first one is a custom format in .txt that you can see in `questions/database.txt`.  
It doesn't support multiple answers.  
The file `database.txt` comes from [WQuizz by Wizou](http://wiz0u.free.fr/wquizz/) and has been modified to fits my needs. Be carefull tough because the 70000 questions are in **french**.  
  
The preferred format is **json**. You can see an example in `questions/questions.json`.  
This format support multiple answers. If you want to verify that your file is valid, you can paste its content on [JSONLint](http://jsonlint.com/).

###Data saves
Currently only user informations are saved in `data/userlist.json`.    
It just serializes the variable when a question ends and parses it when the bot loads.  
The account starting the bot (with `node index.js`) must have the right to write in the `./data` folder.

###TODO
* Change question files without the need to restart the bot.
* Ask custom question.
* Allow a user who isn't OP and who started a quizz to stop it as well.
* Support multiple channel at the same time.
* Add english default questions.
* Support more languages.
* Improve tips display when asking multiple answers question.  

###Libraries
QuizzBot is using:  

* [NodeJS](https://nodejs.org/) 
* [fuzzyset.js](http://glench.github.io/fuzzyset.js/)
* [WQuizz questions](http://wiz0u.free.fr/wquizz/)
* [i18n](https://github.com/mashpie/i18n-node)
* [node-irc](https://github.com/martynsmith/node-irc)
