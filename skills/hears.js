const _ = require("underscore");
const request = require("request");

const { WebClient } = require('@slack/client');

const token = process.env.slackToken;

var web = new WebClient(token);

var eggIntervalId;
var chickIntervalId;

var emojis = [];

var specialEmojis = [":fried_egg:"];


module.exports = function(controller) {

  var deleteThisMsg = function(message, token, callback) {

    // console.log(message, "we are deleting this");

    var ts = message.message_ts ? message.message_ts : message.ts;

    var web = new WebClient(token);

    web.chat.delete(ts, message.channel).then(res => {
      // console.log(res, "deleted");
      callback();
    }).catch(err => console.log(err));
  }
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

  _.each(specialEmojis, function(sp) {
    emojis.splice(emojis.indexOf(sp), 1);

  });

  // Hears Functions
  controller.hears(["return"], ["direct_message","direct_mention","mention","ambient"], function(bot,message) {

    if (process.env.environment != 'dev') return;
    controller.storage.teams.get(message.team_id, function(err, res) {
      res.users = _.map(res.users, function(user) {
        if (user.userId == message.user) {
          return { userId: user.userId, name: user.name };
        } else
          return user;
      });
      controller.storage.teams.save(res, function(err, saved) {
        console.log(saved, "saved this team, all clear!!");
        bot.reply(message, "thanks, make sure to pickup a new egg!");
      });
    });

  });

  controller.hears(["restart"], ["direct_message","direct_mention","mention","ambient"], function(bot,message) {

    console.log("start");
    if (process.env.environment != 'dev') return;
    controller.trigger("new", [bot, message]);

  });

  controller.hears(["clear_fgh_secret"], ["direct_message","direct_mention","mention","ambient"], function(bot,message) {

    // console.log("start");

    if (message.match[0] != "clear_fgh_secret") return;
    
    controller.store.getTeam(message.team_id)
    .then(team => {
      
      console.log("got team: ", team);
      
      var web = new WebClient(team.bot.token);
      // list out users to add to team
      web.users.list({}, function (err, users) {

        team.users = [];

        _.each(users.members, function(user) {
          if (controller.isUser(user)) {
            var user = {
              userId: user.id,
              name: user.name
            }

            team.users.push(user);
          }
        });
        
        controller.store.teams[team.id] = team
        bot.reply(message, "thanks, make sure to pickup a new egg!");
      });
      
    })
    .catch(err => controller.logger.error(err))

  });

  controller.hears("new (.*)", ["direct_message"], function(bot,message) {

    if (process.env.environment != 'dev') return;

    if (!["chicken", "shrimp", "snake", "turtle", "lizard"].includes(message.text.split(" ")[1])) return;

    controller.storage.teams.get(message.team_id, function(err, res) {
      res.users = _.map(res.users, function(user) {
        if (user.userId == message.user) {
          user.tamagotchi_type = message.text.split(" ")[1];
          user.tamagotchi_started = true;
          user.tamagotchi_stage = 0;
          user.tamagotchi_over = false;
        }
        return user;
      });

      controller.storage.teams.save(res, function(err, saved) {

        controller.trigger('new', [bot, message]);

      });
    });
  });

  controller.hears("(.*)", ["direct_message"], function(bot, message) {
    
    controller.store.getTeam(message.team_id)
    .then(team => {

      const thisUser = _.findWhere(team.users, { userId: message.user });
      console.log(`${thisUser.name} just sent the ${thisUser.tamagotchi_type} tamagotchi "${message.text}"`);
      console.log(thisUser, " is all the user's data")

      if(!thisUser.tamagotchi_over && thisUser.tamagotchi_started && thisUser.tamagotchi_stage == 0) {
        controller.trigger("emoji_message", [bot, message, thisUser.tamagotchi_type]);
      } else {
        deleteThisMsg(message, team.oauth_token, function() {
          // console.log("no thanks");
        });
      }
      
    })
    .catch(err => controller.logger.error(err));
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
