const _ = require("underscore");
var debug = require('debug')('botkit:onboarding');

module.exports = function(controller) {

    controller.on('onboard', function(bot) {

        debug('Starting an onboarding experience!');

        if (controller.config.studio_token) {
          bot.api.im.open({user: bot.config.createdBy}, function(err, direct_message) {
            if (err) {
                debug('Error sending onboarding message:', err);
            } else {
              // console.log(direct_message);
              console.log(bot.identity.team_id); //T8MJ05ZPY
              // console.log(bot.config.createdBy); //U8LN5CEKU
              controller.storage.teams.get(bot.identity.team_id, function(err, team) {
                console.log(team);
                var thisUser = _.findWhere(team.users, { userId: bot.config.createdBy });
                console.log(thisUser);
                controller.studio.get(bot, 'onboarding', bot.config.createdBy, direct_message.channel.id).then(function(convo) {
                  // console.log(convo.context);
                  convo.icon_url = "http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg";
                  var value = convo.threads.default[0].attachments[0].actions[0].value + " " + thisUser.tamagotchi_type;
                  
                  convo.threads.default[0].attachments[0].actions[0].value = value;
                  
                  console.log(value, convo.threads.default[0].attachments[0].actions[0].value);
                  convo.activate();
                });
              });
              
            }
          });
        } 
    });

}
