module.exports = function(controller) {
  
  controller.warmthLogic = function(bot, message, user, vars, cb) {

    setProgress(user.warmth, user.warmthMeter, "warmth");

    controller.getStatus("warmth", user.warmth, function(result) {
      
      console.log(result, user.hatched);
      
      if (result.action != 'death') {

        if (result.action == "hatched" && !user.hatched) {
          console.log("we have hatched!!!!!!!");
          user.newChicken = true;
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
  
  controller.hungerLogic = function(bot, message, user, vars, cb) {
    
    setProgress(user.hunger, user.hungerMeter, "hunger");

    controller.getStatus("hunger", user.hunger, function(result) {

      if (result.action == "full") 
        user.fullCount++;

      if (result.action != 'death') {

        var msg = "";
        
        if (vars.text)
          msg = vars.text;
        
        if (user.fullCount >= 10) {
          controller.killTimer("all", function() {
            msg += "Thanks for helping me thrive! Enjoy this alphanumeric code: sqd09erbs2. To restart, type 'new tamagotchi'.\n";
            say(msg, bot, message);
            return;
            
          });
        }

        say(msg + result.msg, vars.chickEmoji, bot, message, { meter: user.hungerMeter });

      } else 
        controller.trigger("death", [bot, message, user, result.msg]);

      cb(user);

    });
    
  };
  
  
  controller.poopLogic = function(bot, message, user, vars, cb) {

    setProgress(user.poopsPooped, user.poopMeter, "poop");

    controller.getStatus("poop", user.poopsPooped, function(result) {
      
      if (result.action != 'death') 
        say(result.msg, vars.chickEmoji, bot, message, { meter: user.poopMeter });
      else {
        controller.trigger("death", [bot, message, user, result.msg]);
      }

      cb(user);

    });
    
  };
  
  controller.cleanLogic = function(bot, message, user, vars, cb) {

    setProgress(user.poopsPooped, user.poopMeter, "poop");

    var msg;

    if(user.poopsPooped == 0) {
      msg = "All Clean! Thanks!\n";
    }
    else {
      msg = "Thanks!\n";
    }

    say(msg, vars.chickEmoji, bot, message, { meter: user.poopMeter });
    
    cb(user);
    
  };
  
  var setProgress = function(int, progress, type) {
    
    console.log(int, type);
    var check = type == "warmth" ? ":white_check_mark:" : type == "hunger" ? ":negative_squared_cross_mark:" : ":poop:";
    var nope = type == "warmth" ? ":o:" : ":x:";
    
    if (type == "poop") {
      for(var x = 0; x < int; x++){
          progress[x] = check;
      }

    } else {

      for(var x = 0; x < int/5; x++){
          progress[x] = check;
      }
    
      for(var x = int/5; x < 20; x++){
          progress[x] = nope;
      }
          
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