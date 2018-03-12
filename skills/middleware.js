const request = require("request");
const _ = require("underscore");

var emojis = [];

var sunEmojis = [":sunny:", ":mostly_sunny:", ":sun_small_cloud:"];
var warmEmojis = [":hotsprings:"];
var hotEmojis = [":fire:"];

var coolEmojis = [":partly_sunny:", ":barely_sunny:", ":partly_sunny_rain:", ":cloud:"];
var rainEmojis = [":thunder_cloud_and_rain:", ":rain_cloud:", ":umbrella_with_rain_drops:"];
var snowEmojis = [":snow:", ":snowman:"];

/*
// INTERNAL PLAYTEST
var sunEmojis = [":sunny:", ":mostly_sunny:", ":sun_small_cloud:"];
var warmEmojis = [":hotsprings:"];
var hotEmojis = [":fire:"];

var coolEmojis = [":partly_sunny:", ":barely_sunny:", ":partly_sunny_rain:", ":cloud:"];
var rainEmojis = [":thunder_cloud_and_rain:", ":rain_cloud:", ":umbrella_with_rain_drops:"];
var snowEmojis = [":snow:", ":snowman:"];
*/

var triggers = ["onboarding", "start", "restart", "clear"];
module.exports = function(controller) {
  
  // Emoji request 
  request("https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json", function(err, res, body) {
    if (!err && res.statusCode == 200) {
       var importedJSON = JSON.parse(body);
      // console.log(importedJSON);
      
      _.each(importedJSON, function(item) {
        // console.log(item.short_name);
        emojis.push(":" + item.short_name + ":");
      });
    }
  });

  controller.middleware.receive.use(function(bot, message, next) {
    
      var emojiMessage = 0;
      var thisEmoji;
    
      if (!message.event)
        next();
    
      if (message.event.user && !triggers.includes(message.event.text)) {

        _.each(message.event.text.split(" "), function(word) {
          if (emojis.includes(word)) {
            console.log("it's an emoji!");
            emojiMessage++;
            if (!thisEmoji)
              thisEmoji = word;
          } 
        });

        console.log(thisEmoji, emojiMessage);

        var amount;

        if (emojiMessage > 0) {

          if (emojiMessage > 1) {
            amount = -1;
          } else {
            amount = checkEmojis(thisEmoji);
          }

        } else {
          amount = -1;
        }

        console.log(message.event);
        
        var messageUser = message.user ? message.user : message.event.user;

        controller.storage.teams.get(message.team_id, function(err, res) {

          // console.log(res.users, message.event);

          var thisUser = _.findWhere(res.users, { userId: messageUser });

          if(!thisUser.gameOver && thisUser.started) {
            controller.trigger("warmth", [bot, message, thisUser, amount, true]);
          }

        });
      } 
    
      next();
      
    });
  
}

var checkEmojis = function(item) {
  var score = -1;
    
  if (sunEmojis.includes(item) || item == ":bulb:") {
     score = 1; 
  } else if (warmEmojis.includes(item)) {
     score = 2; 
  } else if (hotEmojis.includes(item)) {
    score = 3;
  } else if (coolEmojis.includes(item)) {
     score = -1;
  } else if (rainEmojis.includes(item)) {
     score = -2;
  } else if (snowEmojis.includes(item)) {
    score = -3;
  }
  
  return score;
}