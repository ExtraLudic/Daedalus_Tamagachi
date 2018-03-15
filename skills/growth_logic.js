

module.exports = function(controller) {
  
  controller.warmthLogic = function(bot, message, user, vars, cb) {

    setProgress(user.warmth, user.warmthMeter, user.tamagotchi_type);

    controller.getStatus(user.tamagotchi_type, user.warmth, vars.input, function(result) {
      
      console.log(result, result.action);
      
      if (result.action != 'death') {

        if (result.action == "hatched" && !user.hatched) {
          console.log("we have hatched!!!!!!!");
          user.newHatch = true;
          user.hatched = true;
        }

        var msg = "";
        
        if (vars.text)
          msg = vars.text;
        
        var emoji = vars.eggEmoji;
        if(user.hatched) emoji = vars.chickEmoji;

        say(msg + result.msg, emoji, bot, message, { meter: user.warmthMeter });

      } else 
        controller.trigger("death", [bot, message, user, result.msg]);

      cb(user);

    });
    
  };
  
  
  var setProgress = function(int, progress, type) {
    
    console.log(int, type);
    var check = ":white_check_mark:";
    var nope = ":o:";
    
    for(var x = 0; x < int/5; x++){
        progress[x] = check;
    }

    for(var x = int/5; x < 20; x++){
        progress[x] = nope;
    }
    
  }
  
  var say = function(text, emoji, bot, message, options) {
    console.log("bot gonna say", text);
    // console.log(options);
    var reply = { text: text, icon_url: emoji, username: "Tamagotchi Puzzle" };
  
    if (options) {

      if (options.meter) {
        reply.text += "\n\n";
        // console.log(text);
        for(var y = 0; y < options.meter.length; y++){
            reply.text += options.meter[y];
          // console.log(text);
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
  
};