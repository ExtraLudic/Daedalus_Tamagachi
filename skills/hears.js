var _ = require("underscore");

const { WebClient } = require('@slack/client');

const token = process.env.slackToken;

var web = new WebClient(token);

var channel = 'C8X8SJM0Q';

var eggIntervalId;
var chickIntervalId;


module.exports = function(controller) {
  
  // Hears Functions
  
  controller.hears(["restart", "start"], ["direct_message","direct_mention","mention","ambient"], function(bot,message) {
    
    console.log("start");
    controller.trigger("new", [bot, message, true]);
          
  });
  
  controller.hears(["clear"], ["direct_message","direct_mention","mention","ambient"], function(bot,message) {
    
    console.log("start");
    controller.trigger("new", [bot, message, false]);
          
  });
  
  
    // Accidental Death
  controller.hears([":fried_egg:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    
    controller.storage.teams.get(message.team_id, function(err, res) {
      
      var thisUser = _.findWhere(res.users, { userId: message.user });
    
      if(!thisUser.gameOver && thisUser.started) {
        controller.trigger("warmth", [bot, message, thisUser, true, true]);
      }
      
    });
      
    
  });
  
  
}


function say(text, emoji, bot, message, options) {
    
    if (options) {
      if (options.meter) {
        for(var y = 0; y < options.meter.length; y++){
            text += options.meter[y];
        }
      }
    }
    
    bot.reply(message, {
       text: text,
       icon_url: emoji
    });
    
}
  