const _ = require("underscore");
// Timeout Variables
var eggTimeout = 5000;
var chickTimeout = 5000;

var progress = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"];
var hungerMeter = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"];
var poopMeter = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"]

var eggEmoji = "http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg";
var daedalusEmoji = "https://avatars.slack-edge.com/2017-11-08/269162770516_e2c4553016a99b14da83_72.png";
var chickEmoji = "http://d2trtkcohkrm90.cloudfront.net/images/emoji/apple/ios-10/256/front-facing-baby-chick.png";
var skullEmoji = "https://www.emojibase.com/resources/img/emojis/apple/x1f480.png.pagespeed.ic.sgphl_7Fk3.png";

module.exports = function(controller) {
  
  var say = function(text, emoji, bot, message, options) {
    console.log("bot gonna say");
    var reply = { text: text, icon_url: emoji, username: "Tamagotchi Puzzle" };
  
    if (options) {

      if (options.meter) {
        text += "\n";
        for(var y = 0; y < options.meter.length; y++){
            text += options.meter[y];
        }
      }

      if (options.attachment) {
        var attachments = options.attachment;
        reply.attachments = attachments;
      }
      
      if (options.username)
        reply.username = options.username;
    }
    
    reply.channel = message.channel;
      
    reply.username = reply.username + " ";
    
    bot.say(reply);

  }
  
  controller.on('new', function(bot, message, start, type) {
    
    console.log(message.user);
    
    var messageUser = message.user ? message.user : message.event.user;
    
    console.log(messageUser);

    controller.storage.teams.get(bot.config.id, function(err, res) {
      
      var thisUser = _.findWhere(res.users, { userId: messageUser });
      if (start){
        // trigger new tamagotchi
        controller.trigger("start", [{
          bot: bot,
          message: message,
          team: res, 
          user: thisUser, 
          type: type
        }]);
      }
    });
  });
 
  controller.on('start', function(options) {
    
    console.log("starting over");

    var message = options.message;
    var bot = options.bot;
    var team = options.team;
    var thisUser = options.user;
    
    thisUser.hatched = false;
    
    thisUser.gameOver = false;
    thisUser.started = true;
    
    thisUser.warmth = 50;
    
    if (options.type == "snake")
      thisUser.warmth = 30;
        
    thisUser.warmthMeter = progress;
    
    var users = _.map(team.users, function(user) {
      if (user.userId == thisUser.userId) {
        return thisUser;
      } else 
        return user;
    });
    
    team.users = users;
    
    // console.log(team.users);
    
    controller.storage.teams.save(team, function(err, saved) {
      // console.log(err, saved.users);
      var savedUser = _.findWhere(saved.users, { userId: thisUser.userId });
      // console.log(savedUser);
      controller.trigger("egg", [bot, message, savedUser, thisUser.tamagotchi_type]);
    });
    
  });
  
  controller.on("egg", function(bot, message, user, type) {
    var text;
    
    if (["chicken", "shrimp", "snake"].includes(type)) 
      text = "Hello! Please hatch me. I’m cold. Can you warm me up?";
    else if (type == "lizard")
      text = "Hello! Please hatch me. It’s too hot. Can you warm me up?";
    else if (type == "turtle")
      text = "Hello! Please hatch me. It’s too hot. Can you cool me down?";
    else 
      text = "What am I ?? Cann ot comput e!! 12095-=F DF 535_ffjpj, F,. C";

    say(text, eggEmoji, bot, message);
    
    console.log(user.warmth, "the user who has an egg");
    console.log(user.userId);
    
    var vars = {
      eggEmoji: eggEmoji, 
      chickEmoji: chickEmoji
    }
    
    setTimeout(function() {

      controller.warmthLogic(bot, message, user, vars, function(updated) {
        console.log(updated);
         saveTeam(bot.config.id, updated);
      });
    
    }, 500);
        
    
  });
  
  
  controller.on("warmth", function(bot, message, user, amount, input) { 
        
    user.newChicken = false;
          
    user.warmth += amount*5;

    var vars = {
      input: input,
      eggEmoji: eggEmoji, 
      chickEmoji: chickEmoji
    }

    controller.warmthLogic(bot, message, user, vars, function(updated) {
      input = false;
      if (updated.hatched) {
        updated.gameOver = true;
        updated.started = false;
      }
      saveTeam(bot.config.id, updated, function(saved) {

        setTimeout(function() {
          if (saved.newHatch && saved.hatched) {
            controller.trigger("egg_hatched", [bot, message, saved]);
            say("Wowee, nice work, I've hatched!", chickEmoji, bot, message);
          }
        }, 500);

      });
      
    });
      
  });
  
  
  controller.on("death", function(bot, message, user, text) {
    
    user.gameOver = true;
    user.started = false;
    
    saveTeam(bot.config.id, user, function(saved) {
    
      if (!text) text = "You lose!";

      var attachment = [{
        "text": "Click to start over",
        "callback_id": "restart_game",
        "attachment_type": "default",
        "actions": [
            {
                "name": "say",
                "text": "Restart",
                "type": "button",
                "value": "start"
            },
        ]
      }];
      
      say(text, skullEmoji, bot, message, { attachment: attachment });

      
    });
    
  });
 
  
  var saveTeam = function(teamId, user, cb) {
    
    controller.storage.teams.get(teamId, function(err, result) {
      
      // console.log(result, "is the team being saved");
      var currentUser;
      
      var updated = _.map(result.users, function(u) {
        if (u.userId == user.userId) {
          currentUser = user;
          return user;
        } else 
          return u;
      });
      
      result.users = updated;
      // console.log(currentUser.newChicken, "is the current user newChicken");
            
      controller.storage.teams.save(result, function(err, saved) {
        // console.log(err, saved.users);
        if (cb) cb(currentUser);
      });

    });

  }


    
}