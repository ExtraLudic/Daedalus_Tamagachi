const _ = require("underscore");

function isUser(member) {
  // console.log(member.name, "is the member being checked");
  if (member.is_bot || member.name == process.env.botName || member.name == "slackbot")
    return false;
  else
    return true;
}

module.exports = function(controller) {
  
  controller.middleware.receive.use(function(bot, message, next) {
    if (message.type == 'interactive_message_callback') {
      // Say something
      if (message.actions[0].name.match(/^say$/)) {

        var reply = message.original_message;

        if (message.actions[0].value == "start") {
          
          console.log("button says start");
          
          controller.trigger("new", [bot, message, true]);
          
        }

      }
      
    }
    
    next();  

  });
  
};