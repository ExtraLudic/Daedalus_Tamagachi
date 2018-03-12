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
  
  
//     // Nice N Warm
//   controller.hears([":sunny:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    
//     controller.storage.teams.get(message.team_id, function(err, res) {
      
//       var thisUser = _.findWhere(res.users, { userId: message.user });
    
//       if(!thisUser.gameOver && thisUser.started) {
//         controller.trigger("warmth", [bot, message, thisUser, true, true]);
//       }
      
//     });
      
    
//   });
  
//   // Cool
//   controller.hears([":mostly_sunny:", ":partly_sunny:", ":barely_sunny:", ":partly_sunny_rain:", ":cloud:", ":rain_cloud:", ":thunder_cloud_and_rain:", ":lightning:", ":zap:", ":snowflake:", ":snow_cloud:", ":tornado:", ":fog:", ":umbrella_with_rain_drops:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    
//     controller.storage.teams.get(message.team_id, function(err, res) {
//       var thisUser = _.findWhere(res.users, { userId: message.user });
//       if(!thisUser.gameOver && thisUser.started) {
//         controller.trigger("warmth", [bot, message, thisUser, false, true]);
//       }
//     });
    
//   });
  
  
//   // Good food
//   controller.hears([":green_apple:", ":apple:", ":pear:", ":tangerine:", ":lemon:", ":banana:", ":watermelon:", ":grapes:", ":strawberry:", ":melon:", ":cherries:", ":peach:", ":pinapple:", ":tomato:", ":eggplant:", ":hot_pepper:", ":corn:", ":sweet_potato:"],["direct_message","direct_mention","mention","ambient"], function(bot,message) {
    
//     controller.storage.teams.get(message.team_id, function(err, res) {
      
//       var thisUser = _.findWhere(res.users, { userId: message.user });
      
//       // console.log("nice food choice", thisUser);
//       if(!thisUser.gameOver && thisUser.started && thisUser.hatched) {
//         controller.trigger("food", [bot, message, thisUser, true, true]);
//       }
      
//     });
    
//   });
  
// // Bad food
//   controller.hears([":honey_pot:", ":bread:", ":cheese_wedge:", ":poultry_leg:", ":meat_on_bone:", ":fried_shrimp:", ":egg:", ":hamburger:", ":fries:", ":hotdog:", ":pizza:", ":spaghetti:", ":taco:", ":burrito:", ":ramen:", ":stew:", ":fish_cake:", ":sushi:", ":bento:", ":curry:", ":rice_ball:", ":rice:", ":rice_cracker:", ":oden:", ":dango:", ":shaved_ice:", ":ice_cream:", ":icecream:", ":cake:", ":birthday:", ":custard:", ":candy:", ":lollipop:", ":chocolate_bar:", ":popcorn:", ":doughnut:", ":cookie:", ":beer:", ":beers:", ":wine_glass:", ":cocktail:", ":tropical_drink:", ":champagne:", ":sake:", ":tea:", ":coffee:", ":baby_bottle:"],["direct_message","direct_mention","mention","ambient"], function(bot,message) {
    
//     controller.storage.teams.get(message.team_id, function(err, res) {
      
//       var thisUser = _.findWhere(res.users, { userId: message.user });
//           if(!thisUser.gameOver && thisUser.started && thisUser.hatched) {

//       controller.trigger("food", [bot, message, thisUser, false, true]);
//           }
      
//     });
    
//   });
  
//   // Poop hears
//   controller.hears([":sweat_drops:", ":droplet:", ":potable_water:", ":ocean:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    
//     controller.storage.teams.get(message.team_id, function(err, res) {
      
//       var thisUser = _.findWhere(res.users, { userId: message.user });
//       if(!thisUser.gameOver && thisUser.started && thisUser.hatched) {
//         controller.trigger("cleanup", [bot, message, thisUser ]);
//       }
      
//     });
    
//   });

  
//   // stop everything
//   controller.hears(["stop", "quit"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    
//     controller.killTimer("all", function() {
//       console.log("stopping");
//     });

//   });
  
//   controller.hears(["chicken"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
//     controller.trigger("new", [bot, message, "chicken"]);

//   });
  
  
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
  