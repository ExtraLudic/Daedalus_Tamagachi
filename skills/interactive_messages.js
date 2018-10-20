const _ = require("underscore");

function isUser(member) {
  // console.log(member.name, "is the member being checked");
  if (member.is_bot || member.name == process.env.botName || member.name == "slackbot")
    return false;
  else
    return true;
}

module.exports = function(controller) {
  
  controller.on('interactive_message_callback', function(bot, event) {
    
    console.log(event.actions[0].name, "is the interactive message callback event");
    
    // Catch for the "Look at egg" button
    if (event.actions[0].name.match(/^say(.*)$/)) {

      var reply = event.original_message;

      console.log(event.actions[0].value);
      var type = event.actions[0].value.split(" ")[1];

      controller.trigger("new", [bot, event, type]);

    }
    
    // Catch for the buttons on the chess board
    if (event.actions[0].name.match(/^boardBtn$/)) {
      
      controller.store.getTeam(event.team.id)
      .then(team => {
        
        var thisUser = _.findWhere(team.users, { userId: event.user });
        var btnClicked = event.actions[0].value;
                
        var opts = {
          bot: bot, 
          event: event, 
          user: thisUser, 
          btn: btnClicked
        }
        
        controller.trigger("board_button", [opts]);
        
      }).catch(err => controller.logger.error(err))
    }
    
  });
  
};