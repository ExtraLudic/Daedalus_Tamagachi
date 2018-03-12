var debug = require('debug')('botkit:onboarding');

module.exports = function(controller) {

    controller.on('onboard', function(bot) {

        debug('Starting an onboarding experience!');

        if (controller.config.studio_token) {
          bot.api.im.open({user: bot.config.createdBy}, function(err, direct_message) {
            if (err) {
                debug('Error sending onboarding message:', err);
            } else {
              console.log(direct_message);
              console.log(bot.config.createdBy);
              controller.studio.get(bot, 'onboarding', bot.config.createdBy, direct_message.channel.id).then(function(convo) {
                // console.log(convo.context);
                convo.icon_url = "http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg";
                convo.activate();
              });
            }
          });
        } 
    });

}
