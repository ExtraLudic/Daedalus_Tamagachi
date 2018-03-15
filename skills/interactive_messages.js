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
    
    if (event.actions[0].name.match(/^say(.*)$/)) {

      var reply = event.original_message;

      console.log(event.actions[0].value)
      var type = event.actions[0].value.split(" ")[1];

      controller.trigger("new", [bot, event, true, type]);

    }
    
  });
  
};