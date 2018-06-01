var debug = require('debug')('botkit:channel_join');
const _ = require("underscore");
const { WebClient } = require('@slack/client');

module.exports = function(controller) {

    controller.on('team_join', function(bot, message) {

        console.log("a user joined", message);
        if (!controller.isUser(message.user)) return;
      
        controller.storage.teams.get(message.team_id, function(err, team) {
          
          if (_.findWhere(team.users, { userId: message.user.id })) return;
          
          team.users.push({
            userId: message.user.id, 
            name: message.user.name
          });
          
          team.users = team.users;
          
          controller.storage.teams.save(team, function(err, saved) {
            console.log(saved, "someone joined so we added them to the users list");
            
          });
        });
      
    });

}
