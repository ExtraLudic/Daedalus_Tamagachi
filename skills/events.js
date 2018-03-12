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




function isUser(member) {
  console.log(member.name, member.id);
  if (member.is_bot || member.name == process.env.botName || member.name == "slackbot")
    return false;
  else
    return true;
}


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
  
  controller.on('new', function(bot, message, start, stage) {
    
    console.log(message.user);
    
    var messageUser = message.user ? message.user : message.event.user;
    
    console.log(messageUser);

    controller.storage.teams.get(bot.config.id, function(err, res) {
            
      bot.api.users.list({}, function (err, users) { 
        // console.log(users.members)
        if (!res.users) {
          res.users = [];

          _.each(users.members, function(user) {
            if (isUser(user)) {
              res.users.push({
                userId: user.id, 
                name: user.name
              });
            }
          }); 

        }
        console.log(res.users);
        // find this user 
        var thisUser = _.findWhere(res.users, { userId: messageUser });
        var thisStage = stage ? stage : "egg";
        
        console.log(thisUser);

        controller.storage.teams.save(res, function(err, saved) {
          if (start){
            // trigger new tamagotchi
            controller.trigger("start", [{
              bot: bot,
              message: message,
              team: saved, 
              user: thisUser, 
              stage: thisStage
            }]);
          }
        });

      });
      
    });
  });
 
  controller.on('start', function(options) {
    
    console.log("starting over");

    var message = options.message;
    var bot = options.bot;
    var team = options.team;
    var thisUser = options.user;
    
    thisUser.hatched = false;
    thisUser.newChicken = false;
    
    thisUser.gameOver = false;
    thisUser.started = true;
    thisUser.warmth = 50;
    thisUser.hunger = 50;
    
    thisUser.hatchedCount = 0;
    thisUser.fullCount = 0;
    
    thisUser.poopCount = 0;
    thisUser.poopsPooped = 0;
    
    thisUser.warmthMeter = progress;
    thisUser.hungerMeter = hungerMeter;
    thisUser.poopMeter = poopMeter;
    
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
      controller.trigger(options.stage, [bot, message, savedUser]);
    });
    
  });
  
  controller.on("egg", function(bot, message, user) {
    
    say("I'm an egg! Keep me warm to hatch me!", eggEmoji, bot, message);
    
    console.log(user.warmth, "the user who has an egg");
    console.log(user.userId);
    
    var vars = {
      eggEmoji: eggEmoji, 
      chickEmoji: chickEmoji
    }
    
    setTimeout(function() {

      controller.warmthLogic(bot, message, user, vars, function(updated) {
         saveTeam(bot.config.id, updated);
      });
    
    }, 500);
        
    
  });
  
  controller.on("chicken", function(bot, message, user) {
    
    say("I'm a chicken! Keep me warm but also feed me!", chickEmoji, bot, message);
    
    var vars = {
      eggEmoji: eggEmoji, 
      chickEmoji: chickEmoji
    }     
    
    controller.storage.teams.get(bot.config.id, function(err, team) {

      var thisUser = _.findWhere(team.users, { userId: user.id });

      setTimeout(function() {
        
        controller.hungerLogic(bot, message, thisUser, vars, function(updated) {
          saveTeam(bot.config.id, updated);
        });

        controller.warmthLogic(bot, message, thisUser, vars, function(updated) {
          saveTeam(bot.config.id, updated);
        });
        
      }, 500);
    });
        
  });
  
  controller.on("warmth", function(bot, message, user, good, input) { 
        
    user.newChicken = false;
          
    user.warmth += good*5;

    var text = good ? "Yum! Thanks, I love sun!\n" : "Hmm, that's not what I'm looking for..I'm getting colder!\n";

    var vars = {
      text: text,
      input: input,
      eggEmoji: eggEmoji, 
      chickEmoji: chickEmoji
    }

    controller.warmthLogic(bot, message, user, vars, function(updated) {
      input = false;
      if (updated.newChicken && updated.hatched) {
        updated.gameOver = true;
        updated.started = false;
      }
      saveTeam(bot.config.id, updated, function(saved) {

        setTimeout(function() {
          if (saved.newChicken && saved.hatched) {
            say("Wowee, nice work, I've hatched! You win this special code I wrote just for you: sqd09erbs2\nIf you'd like to play again, just type 'start'!", chickEmoji, bot, message);
          }
        }, 500);

      });
      
    });
      
  });
  
  
  // Food
  controller.on("food", function(bot, message, user, good, input) {
  
    console.log("food event");
    controller.killTimer("hunger", function() {
      user.newChicken = false;
      var text = good ? "Ooh! Yummy!\n" : "Yuck! No thank you.\n";

      good ? user.hunger += 5 : user.hunger -= 5;

      if (good)
        user.poopCount++;

      console.log("that did something! hunger is now: ", user.hunger);

      var vars = {
        text: text,
        input: input,
        eggEmoji: eggEmoji, 
        chickEmoji: chickEmoji
      }
      
      controller.hungerLogic(bot, message, user, vars, function(updated) {
        input = false;
        
        if (user.poopCount == 3) {
          user.poopsPooped++;
          user.poopCount = 0;
          
          controller.poopLogic(bot, message, user, vars, function(u) {
            saveTeam(bot.config.id, updated, function(saved) {
              
              controller.timer(true, saved.userId, "hunger", function(id) {

                controller.storage.teams.get(bot.config.id, function(err, team) {

                  var thisUser = _.findWhere(team.users, { userId: id });

                  if(thisUser.hunger < 0)
                    thisUser.hunger = 0;
                  else if(thisUser.hunger <= 100) 
                    thisUser.hunger -= 5;
                  
                  console.log("we are in the hunger event timer");

                  controller.hungerLogic(bot, message, thisUser, vars, function(updated) {
                    saveTeam(bot.config.id, updated);
                  });

                });

              });

            });
          });
        } else {
                
          saveTeam(bot.config.id, updated, function(saved) {

            controller.timer(true, saved.userId, "hunger", function(id) {

              controller.storage.teams.get(bot.config.id, function(err, team) {

                var thisUser = _.findWhere(team.users, { userId: id });

                if(thisUser.hunger < 0)
                  thisUser.hunger = 0;
                else if(thisUser.hunger <= 100) 
                  thisUser.hunger -= 5;
                else if (thisUser.hunger > 100)
                  controller.trigger("death", [bot, message, thisUser, "That was too much food! I've fallen over from the weight!"]); 

                console.log("we are in the hunger event timer");

                controller.hungerLogic(bot, message, thisUser, vars, function(updated) {
                  saveTeam(bot.config.id, updated);
                });

              });

            });

          });
          
        }
      });

      
    });
          
  });
  
  controller.on("cleanup", function(bot, message, user) {
    
    console.log("in cleanup", user.poopsPooped);
    if(user.poopsPooped > 0) {

      user.poopsPooped -= 1;
      
      var vars = {
        eggEmoji: eggEmoji, 
        chickEmoji: chickEmoji
      }
      
      controller.cleanLogic(bot, message, user, vars, function(updated) {
            
        saveTeam(bot.config.id, user, function(saved) {

          controller.timer(true, saved.userId, "hunger", function(id) {

            controller.storage.teams.get(bot.config.id, function(err, team) {

              var thisUser = _.findWhere(team.users, { userId: id });

              if(thisUser.hunger < 0)
                thisUser.hunger = 0;
              else if(thisUser.hunger <= 100) 
                thisUser.hunger -= 5;

              console.log("we are in the hunger event timer");

              controller.hungerLogic(bot, message, thisUser, vars, function(updated) {
                saveTeam(bot.config.id, updated);
              });

            });

          });
          
          controller.timer(true, saved.userId, "warmth", function(id) {

            controller.storage.teams.get(bot.config.id, function(err, team) {

              var thisUser = _.findWhere(team.users, { userId: id });

              if(thisUser.warmth < 0)
                thisUser.warmth = 0;
              else if(thisUser.warmth <= 100) 
                thisUser.warmth -= 5;

              console.log("we are in the hunger event timer");

              controller.warmthLogic(bot, message, thisUser, vars, function(updated) {
                saveTeam(bot.config.id, updated);
              });

            });

          });
          
        });
      });

    }
    
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

      controller.killTimer("all", function() {
        say(text, skullEmoji, bot, message, { attachment: attachment });
      });
      
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