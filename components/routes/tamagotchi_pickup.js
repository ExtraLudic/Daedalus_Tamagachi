const _ = require("underscore");
const request = require('request');

module.exports = function(webserver, controller) {

  webserver.post("/pickup", function(req, res) {

    const teamId = req.body.team;
    const player = req.body.player;
    const type = req.body.type;

    console.log(req.body, " is the data we recieved in the pickup route");
    
    controller.store.getTeam(teamId)
    .then(team => {
      
          console.log(team, " is our team");

      
      const bot = controller.spawn(team.bot);
      let thisUser = _.findWhere(team.users, { userId: player });
      const repeated = _.findWhere(team.users, { tamagotchi_type: type });

      // * If this player doesn't exist on the team for any reason
      // Add their userId to the users object
      if (!thisUser) {
        thisUser = { userId: player };
        team.users.push(thisUser);
      }
      
      const finished = thisUser.tamagotchi_over || thisUser.tamagotchi_won

      if (finished || thisUser.tamagotchi_started || repeated) 
        rejectPickup(thisUser, team);
      else {
        thisUser.tamagotchi_type = type
        allowPickup(thisUser, team, bot);
      }
      
    }).catch(err => controller.logger.error(err))

  });
  
  const rejectPickup = (user, team) => {
    console.log("rejecting pickup");
    // WHOA let's rethink
    const data = {
      thread: user.tamagotchi_type ? "holding" : "claimed",
      user: user.userId,
      team: team.id
    }

    request.post({ url: process.env.game_domain + '/tamagotchi_error', form: data }, function(err, req, body) {
      
      controller.store.teams[team.id] = team

    });
  }
  
  const allowPickup = (user, team, bot) => {
    console.log("allowing pickup ", user);
    // find this user
    var updated = _.map(team.users, function(u) {
      if (u.userId == user.id) {
        u.tamagotchi_type = user.tamagotchi_type;
        u.tamagotchi_started = true;
        u.escape_id = user.id;
      }
      return u;
    });

    team.users = updated;
    
    controller.store.teams[team.id] = team
    
    console.log(controller.store.teams[team.id], " we stored this team")
    console.log(user, " is the user that picked up an egg")

    const data = {
      puzzle: user.tamagotchi_type,
      user: user,
      team: team,
      codeType: "tamagotchi_egg"
    };

    // post in the gamelog
    request.post({ 
      url: process.env.game_domain + '/tamagotchi_gamelog', 
      form: data 
    }, function(err, req, body) {
      
      bot.api.im.open({ 
        user: data.user.userId
      }, function(err, direct_message) {
        
        controller.studio.get(bot, 'onboarding', user, direct_message.channel.id)
        .then(function(convo) {

          convo.icon_url = controller.botIcons.egg;
          const value = convo.threads.default[0].attachments[0].actions[0].value + " " + user.tamagotchi_type;

          convo.threads.default[0].attachments[0].actions[0].value = value;
          convo.activate();
          
        })
        .catch(err => controller.logger.error(err));
      });
    });

  }

}
