const request = require("request");
const _ = require("underscore");

var emojis = [];

module.exports = function(controller) {
  
  // Emoji request 
  request("https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json", function(err, res, body) {
    // Get each emoji and add ":" to start/end for slack syntax
    // Store in variable emojis for quick access
    if (!err && res.statusCode == 200) {
       var importedJSON = JSON.parse(body);      
      _.each(importedJSON, function(item) {
        emojis.push(":" + item.short_name + ":");
      });
    }
  });

  controller.on("emoji_message", function(bot, message, type) {

    var messageUser = message.user ? message.user : message.event.user;

    controller.storage.teams.get(message.team_id, function(err, res) {

      var thisUser = _.findWhere(res.users, { userId: messageUser });

      var emojiMessage = 0;
      var thisEmoji;

      // Split the message by spaces and iterate
      _.each(message.event.text.split(" "), function(word) {
        // If the word is an emoji
        // Set thisEmoji to the word 
        if (emojis.includes(word)) {
          console.log("it's an emoji!");
          if (!thisEmoji || thisEmoji == word) {
            thisEmoji = word;
            emojiMessage = 1;
          } else
            emojiMessage++;
        } 
      }); 

      if(!thisEmoji)
        thisEmoji = "text";

      var amount;

      if (emojiMessage > 0) { // Emoji input

        // Any combo of multiple emojis results in -1
        if (emojiMessage > 1) {
          amount = -1;
        } else { 
          // Some tamagotchis are frozen by certain emojis
          if (type == "turtle" && [":snow_cloud:", ":snowflake:", ":snowman:", ":snowman_without_snow:"].includes(thisEmoji)){
            controller.trigger("egg_death", [bot, message, thisUser, "You froze me to death!\n"]);
            return;
          }
          // If not dead, check the emoji's effect
          amount = checkEmojis(thisEmoji, type);
        }

      } else { // Text Input
        
        // Shrimp are killed by text input
        if (type == "shrimp") {
          controller.trigger("egg_death", [bot, message, thisUser, "I don't understand. I died."]);
          return;
        }
        
        // If not dead, check text effect
        amount = checkText(type);
      }
 
      // Send the effect to the warmth event
      controller.trigger("warmth", [bot, message, thisUser, amount, thisEmoji]);

    });

  });
  
}

// Check text effect on different tamagotchis
var checkText = function(type) {
  var score = 0;
  switch (type) {
    case "chicken":
      score = -4;
      break;
      
    case "snake":
      score = -2;
      break;
    
    case "turtle":
      score = 2;
      break;
      
    case "lizard": 
      score = 5;
      break;
  }
  
  return score;
}

// Check emojis effect on different tamagotchis
var checkEmojis = function(item, type) {
  var score = 0;
    
  switch (type) {
    case "chicken":
      if (item == ":fire:")
        score = 3;
      else if (item == ":snowflake:") 
        score = -2;
      else 
        score = -4;
      break;
      
    case "snake":
      if (item == ":sunny:")
        score = 1;
      else  
        score = -3;
      break;
    
    case "lizard":
      if (item == ":sunny:")
        score = 1;
      else if (item == ":snowflake:") 
        score = -2;
      else if (item == ":snow_cloud:")
        score = -3;
      else 
        score = 5;
      break;
      
    case "turtle":
      if (item == ":droplet:")
        score = -2;
      else 
        score = 1;
      break;
      
    case "shrimp":
      if (item == ":fire:")
        score = 2;
      else 
        score = -1;
      break;
  }
  
  return score;
}