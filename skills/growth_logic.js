

module.exports = function(controller) {
  
  // warmth logic - sets progress and text for response to input
  controller.warmthLogic = function(bot, message, user, vars, cb) {

    // Get the meter based on changed warmth
    setProgress(user.warmth, user.warmthMeter, user.tamagotchi_type);

    // Get the status of the egg
    controller.getStatus(user.tamagotchi_type, user.warmth, vars.input, function(result) {
      
      console.log(result, result.action);
      
      // If the egg is not dead
      if (result.action != 'death') {

        // If the egg has hatched
        if (result.action == "hatched" && !user.hatched) {
          user.newHatch = true;
          user.hatched = true;
        }

        var msg = "";
        
        if (vars.text)
          msg = vars.text;
        
        var options = {
          bot: bot, 
          message: message, 
          icon: "egg", 
          user: user, 
          text: msg + result.msg, 
          meter: user.warmthMeter
        }

        // Have egg respond with status
        controller.say(options, function() {
          cb(user);
        });

      } else // If egg died, trigger death event
        controller.trigger("egg_death", [bot, message, user, result.msg]);


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
  
};