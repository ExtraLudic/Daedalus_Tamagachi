const _ = require("underscore");
const request = require("request");

const progress = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"];

const creatures = {
  chicken: [':hatched_chick:', ':chicken:'],
  snake: [':snake:', ':crocodile:'],
  turtle: [':turtle:', ':sauropod:'],
  lizard: [':lizard:', ':t-rex:'],
  shrimp: [':shrimp:', ':dragon:']
}

module.exports = function(controller) {

  controller.on('new', function(bot, message, type) {

    var messageUser = message.user ? message.user : message.event.user;
    
    controller.store.getTeam(bot.config.id)
      .then(team => {
      
        var thisUser = _.findWhere(team.users, { userId: messageUser });
        console.log(`${thisUser} is about to start a new ${type} egg`);
        // trigger new tamagotchi
        controller.trigger("start", [{
          bot: bot,
          message: message,
          team: team,
          user: thisUser,
          type: type
        }]);
        
      }).catch(err => controller.logger.error(err))

  });

  controller.on('start', function(options) {

    const message = options.message;
    const bot = options.bot;
    let team = options.team;
    let thisUser = options.user;

    thisUser.hatched = false;

    thisUser.tamagotchi_over = false;
    thisUser.tamagotchi_started = true;
    thisUser.tamagotchi_stage = 0;

    thisUser.warmth = 50;

    if (options.type == "snake")
      thisUser.warmth = 30;

    thisUser.warmthMeter = progress;

    thisUser.creature = creatures[options.type][0];

    var users = _.map(team.users, function(user) {
      if (user.userId == thisUser.userId) {
        return thisUser;
      } else
        return user;
    });

    team.users = users;
    
    controller.store.teams[team.id] = team
    
    controller.trigger("egg", [bot, message, thisUser, thisUser.tamagotchi_type]);

  });

  controller.on("egg", function(bot, message, user, type) {
    let text;

    if (["chicken", "shrimp", "snake"].includes(type))
      text = "Hello! Please hatch me. I’m cold. Can you warm me up?";
    else if (type == "lizard" || type == "turtle")
      text = "Hello! Please hatch me. It’s too hot. Can you cool me down?";
    else
      text = "What am I ?? Cann ot comput e!! 12095-=F DF 535_ffjpj, F,. C";

    var params = {
      bot: bot,
      message: message,
      user: user,
      text: text,
      icon: "egg"
    };

    controller.say(params, function() {

      setTimeout(function() {

        controller.warmthLogic(bot, message, user, {}, function(updated) {
          saveTeam(bot.config.id, updated);
        });

      }, 500);
    });

  });

  // warmth event - checks the warmth of the tamagotchi egg based on input
  controller.on("warmth", function(bot, message, user, amount, input) {

    // Multiply by 5 for proper percentage
    user.warmth += amount*5;

    // Data storage event
    controller.dataStore(message, "chat", {
      warmth: user.warmth,
      amount: amount
    });

    var vars = {
      input: input
    }

    // Run the warmth logic
    controller.warmthLogic(bot, message, user, vars, function(updated) {

      // Check if user hatched the egg
      if (updated.hatched && updated.newHatch) {
        updated.tamagotchi_stage = 1;
        updated.newBoardBtns = true;
      }

      saveTeam(bot.config.id, updated, function(savedUser) {

        // console.log(saved.stage, " is the stage we just updated");
        if (savedUser.tamagotchi_stage > 0) {

          setTimeout(function() {

            var params = {
              bot: bot,
              message: message,
              user: savedUser,
              text: "Wowee, nice work, I've hatched!",
              icon: savedUser.creature.replace(/:/g, "").replace(/-/g, "")
            };

            controller.say(params, function() {
              // Set up the stage 1 board
              controller.trigger("board_setup", [bot, message, savedUser.tamagotchi_type, savedUser.tamagotchi_stage]);

              var data = {
                puzzle: savedUser.tamagotchi_type,
                user: savedUser,
                team: bot.config.id,
                codeType: "tamagotchi_hatch"
              };

              request.post({ url: process.env.game_domain + '/tamagotchi_gamelog', form: data }, function(err, req, body) {

              });

            });

          }, 500);

        }

      });

    });

  });

  controller.on("win_state", function(bot, message, user, text) {

    user.tamagotchi_over = true;
    user.tamagotchi_won = true;
    user.tamagotchi_started = false;

    saveTeam(bot.config.id, user, function(saved) {

      if (!text) text = "You Won!!";
      var winMsg = text;

      if(["chicken", "lizard"].includes(saved.tamagotchi_type)) {
        winMsg += "\nOh! I know! A hint! You know that bookshelf you saw earlier? Check out the " + process.env.book + " book.";
      }
      else if (["snake", "turtle"].includes(saved.tamagotchi_type)) {
        winMsg += "\nOh! I know! A hint! You know that bookshelf you saw earlier? Check out the " + process.env.page + " page of a book.";
      }
      else if (saved.tamagotchi_type == "shrimp") {
        winMsg += "\nOh! I know! A hint! You know that bookshelf you saw earlier? Check out the " + process.env.line + " line of a page of a book.";
      }

      var creature = saved.creature.replace(/:/g, "");

      var params = {
        bot: bot,
        message: message,
        user: user,
        text: winMsg,
        icon: saved.creature.replace(/:/g, "").replace(/-/g, "")
      };

      controller.say(params, function() {

      });

    });

  });


  controller.on("egg_death", function(bot, message, user, text) {

    user.tamagotchi_over = true;
    user.tamagotchi_started = false;

    // Data storage event
    controller.dataStore(message, "chat", {
      warmth: user.warmth,
      amount: 0
    });

    saveTeam(bot.config.id, user, function(saved) {

      if (!text) text = "I've died!\n";

      text += "Restarting...\n";

      var params = {
        bot: bot,
        message: message,
        user: user,
        text: text,
        icon: "skull"
      };

      controller.say(params, function() {
        setTimeout(function() {
          controller.trigger("new", [bot, message, saved.tamagotchi_type]);
        }, 1500);
      });

    });

  });

  controller.on("creature_death", function(bot, message, user, text) {

    user.tamagotchi_over = true;
    user.tamagotchi_started = false;

    saveTeam(bot.config.id, user, function(saved) {

      if (!text) text = "You lose!";

      var params = {
        bot: bot,
        message: message,
        user: user,
        text: text,
        icon: "skull"
      };

      controller.say(params, function() {
        setTimeout(function() {
         controller.trigger("board_setup", [bot, message, saved.tamagotchi_type, saved.tamagotchi_stage]);
        }, 500);
      });

    });

  });




  const saveTeam = function(teamId, user, cb) {

    controller.store.getTeam(teamId)
    .then(result => {

      let currentUser;

      let updated = _.map(result.users, function(u) {
        if (u.userId == user.userId) {
          currentUser = user;
          return user;
        } else
          return u;
      });

      result.users = updated;
      
      controller.store.teams[teamId] = result
      
      console.log("sending back the current user", currentUser)
      
      if (cb) cb(currentUser)

    }).catch(err => console.log(err));

  }



}
