const _ = require("underscore");

const { WebClient } = require('@slack/client');


function isUser(member) {
  console.log(member.name, member.id);
  if (member.is_bot || member.name == process.env.botName || member.name == "slackbot")
    return false;
  else
    return true;
}

module.exports = function(webserver, controller) {

  webserver.get("/pickup/:type/:player/:team", function(req, res) {
        
    controller.storage.teams.get(req.params.team, function(err, team) {
      
      var token = team.bot.token;

      var web = new WebClient(token);
      web.users.list({}, function (err, users) { 
        team.users = [];
        // console.log(users.members)
        if (!team.users || team.users.length <= 0) {
          team.users = [];

          _.each(users.members, function(user) {
            if (isUser(user)) {
              team.users.push({
                userId: user.id, 
                name: user.name
              });
            }
          }); 

        }
        // find this user 
        var updated = _.map(team.users, function(user) {
          if (user.userId == req.params.player)
            user.tamagotchi_type = req.params.type;

          return user;
        });

        team.users = updated;
        controller.storage.teams.save(team, function(err, saved) {
          console.log("someone grabbed an egg so we saved their type!", saved);

        });
        
      });
    });
    
    // Trigger new Tamagotchi for the player who picked up the thing
    res.render('index', {
      domain: req.get('host'),
      protocol: req.protocol,
      glitch_domain:  process.env.domain,
      layout: 'layouts/default'
    });
        
  });
  
};