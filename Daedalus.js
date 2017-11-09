var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();
var port = process.env.PORT || 1337;
var warmth = 50;
var statusTime = 1000;
var progress = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"]

var gameover = false;

var Botkit = require('botkit');

var controller = Botkit.slackbot();

var bot = controller.spawn({

  token: "xoxb-270188256679-fEXYX18qd7JXMzVGhLF0IfAV"

})

bot.startRTM(function(err,bot,payload) {

  bot.say(
    {
      username: 'Tamagachi',
      text: "I'm an egg. Keep me warm to hatch me.",
      channel: 'C7WLECZAR',
      icon_url: 'http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg'
    }
  );
  if (err) {

    throw new Error('Could not connect to Slack');

  }
setInterval(
function(){
if(statusTime > 0) {
        statusTime -= 1;
    }
    else{
        var statusMsg = "";
        if(warmth > 0 && warmth <= 100) {
            warmth -= 5;
        }
        else if(warmth < 0){
            warmth = 0;
        }
        for(var x = 0; x < warmth/5; x++){
            progress[x] = ":white_check_mark:";
        }
        for(var x = warmth/5; x < 20; x++){
            progress[x] = ":red_circle:";
        }
        var statusMsg = 'My current warmth is at ' + warmth + '%!\n';
        if(warmth <= 100 && warmth >= 80){
            statusMsg += "It's chilly but I'm okay.\n"; 
        }
        else if(warmth < 80 && warmth >= 50){
            statusMsg += "Please turn up the heat now.\n";
        }
        else if(warmth < 50 && warmth >= 20){
            statusMsg += "Critical I need warmth!!!!\n";
        }
        else {
            statusMsg += "I'm like a inch from death, dude! SAVE ME!\n";
        }
        if(warmth > 0 && warmth <= 100) {
        for(var y = 0; y < progress.length; y++) {
            statusMsg += progress[y];
        }
        bot.say(
        {
         username: 'Tamagachi',
         text: statusMsg,
         channel: 'C7WLECZAR',
         icon_url: 'http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg'
        });
        }
        else if (warmth <= 0 && !gameover) {
            bot.say(
        {
         username: 'Tamagachi',
         text: "You lose! Would you like to try again?",
         channel: 'C7WLECZAR',
         icon_url: 'http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg'
        });
            gameover = true;
        }
        statusTime = 1000;
    }
}, 5);
});

controller.hears(["Hello","Hi"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {

  bot.reply(message,'Hello, how are you today?');

});

controller.hears([":sunny:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  statusTime = 1000;
  warmth += 5;
  if(warmth > 100) {
    bot.say(
        {
         username: 'Tamagachi',
         text: "I'm cooked! Would you like to restart?",
         channel: 'C7WLECZAR',
         icon_url: 'http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg'
        });
  }
  for(var x = 0; x < warmth/5; x++){
    progress[x] = ":white_check_mark:";
  }
  var progressMsg = 'Yum! Thanks! My warmth is now at ' + warmth + '%!\n';
  for(var y = 0; y < progress.length; y++) {
    progressMsg += progress[y];
  }
  if(warmth > 100){
    progressMsg = "";
  }
  bot.say(
        {
         username: 'Tamagachi',
         text: progressMsg,
         channel: 'C7WLECZAR',
         icon_url: 'http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg'
        });
});
controller.hears([":mostly_sunny:", ":partly_sunny:", ":barely_sunny:", ":partly_sunny_rain:", ":cloud:", ":rain_cloud:", ":thunder_cloud_and_rain:", ":lightning:", ":zap:", ":snowflake:", ":snow_cloud:", ":tornado:", ":fog:", ":umbrella_with_rain_drops:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  statusTime = 1000;
  if(warmth > 0) {
    warmth -= 5;
    warmth += 5;
    var statusMsg = "";
        if(warmth > 0 && warmth <= 100) {
            warmth -= 5;
        }
        else if(warmth < 0){
            warmth = 0;
        }
        for(var x = 0; x < warmth/5; x++){
            progress[x] = ":white_check_mark:";
        }
        for(var x = warmth/5; x < 20; x++){
            progress[x] = ":red_circle:";
        }
        var statusMsg = "Ooh! That's colder than I want it to be! My current warmth is at " + warmth + '%!\n';
        if(warmth <= 100 && warmth >= 80){
            statusMsg += "It's chilly but I'm okay.\n"; 
        }
        else if(warmth < 80 && warmth >= 50){
            statusMsg += "Please turn up the heat now.\n";
        }
        else if(warmth < 50 && warmth >= 20){
            statusMsg += "Critical I need warmth!!!!\n";
        }
        else {
            statusMsg += "I'm like a inch from death, dude! SAVE ME!\n";
        }
        if(warmth >= 0 && warmth <= 100) {
        for(var y = 0; y < progress.length; y++) {
            statusMsg += progress[y];
        }
        bot.say(
        {
         username: 'Tamagachi',
         text: statusMsg,
         channel: 'C7WLECZAR',
         icon_url: 'http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg'
        });
        }
  }
  else {
    bot.say(
        {
         username: 'Tamagachi',
         text: "You lose! Would you like to restart?",
         channel: 'C7WLECZAR',
         icon_url: 'http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg'
        });
        gameover = true;
  }
  
        statusTime = 1000;
});