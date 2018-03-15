
var statusMsg;
var action;

module.exports = function(controller) {
  
  controller.getStatus = function(type, int, input, callback) {
    
    console.log(type, int);
    console.log(input);
    var status;
    switch (type) {
        
      case "snake":
        status = getSnakeStatus(int, input);
        break;
        
      case "chicken":
        status = getChickenStatus(int, input);
        break;
        
    }
    
    console.log(status);
    
    callback(status);
    
  }
  
  var getChickenStatus = function(warmth, input) {
    action = "";
    statusMsg = 'My current warmth is at ' + warmth + '%!\n';
    if (!input)
      return { msg: statusMsg, action: action };

    if(warmth == 85){
      action = "hatched";
    } 

    if (warmth < 20) {
      statusMsg += "I froze to death. Try again?\n";
      action = "death";
    } else if (warmth > 100) {
      statusMsg += "Oh no, you cooked me! Try again?";
      action = "death";
    }

    if (input == ":fire:" || input == ":snowflake:") {
      var hot = input == ":fire:";

      if (warmth <= 100 && warmth >= 90) {
        statusMsg += hot ? "Ouch! Ouch! Too hot!\n" : "Still too hot!"; 
      } else if(warmth <= 80 && warmth >= 70){
        statusMsg += hot ? "Oh boy, getting close!\n" : "This is a little too cold, can you warm me up please?";
      } else if(warmth < 65 && warmth >= 55){
        statusMsg += hot ? "Thanks! Getting toasty! A little warmer please\n" : "No! I need to warm up now!";
      } else if(warmth <= 50 && warmth >= 20){
        statusMsg += hot ? "Oh thank goodness! I needed that! A little warmer please!\n" : "Oh no, you’re freezing me!";
      }
    } else if (input == "text") {
      statusMsg += "Ack, I don’t understand! Please warm me up!";
    } else {
      statusMsg += "That’s not what I need! Oh no…";
    }
    
    return { msg: statusMsg, action: action }
    
  }
  
  var getSnakeStatus = function(warmth, input) {
    statusMsg = 'My current warmth is at ' + warmth + '%!\n';
    if (!input)
      return { msg: statusMsg, action: action };
    
    if(warmth == 75){
      action = "hatched";
    } 
    
    if (warmth <= 10) {
      statusMsg += "I froze to death. Try again?\n";
      action = "death";
    } else if (warmth >= 95) {
      statusMsg += "Oh no, you cooked me! Try again?";
      action = "death";
    }
    
    if (input == ":sun:") {
      if (warmth <= 100 && warmth >= 90) {
        statusMsg += "Ouch! Ouch! Too hot!\n"; 
      } else if(warmth < 60 && warmth >= 40){
        statusMsg += "Thanks! Getting toasty! A little warmer please\n";
      } else if(warmth < 50 && warmth >= 20){
        statusMsg += "Oh thank goodness! I needed that! A little warmer please!\n";
      }
    } else if (input == "text") {
      statusMsg += "Ack, I don’t understand! Please warm me up!";
    } else {
      statusMsg += "That’s not what I need! Oh no…";
    }
    
    return { msg: statusMsg, action: action };
      
  }
  
  var getLizardStatus = function(warmth, input) {
      statusMsg = 'My current warmth is at ' + warmth + '%!\n';

      if(warmth == 30){
        action = "hatched";
      } 
    
      if (warmth <= 100 && warmth >= 90) {
        statusMsg += input ? "Ouch! Ouch! Too hot!\n" : "Still too hot!"; 
      } else if(warmth <= 75 && warmth >= 65){
        statusMsg += input ? "Oh boy, getting close!\n" : "This is a little too cold, can you warm me up please?";
      } else if(warmth < 65 && warmth >= 50){
        statusMsg += input ? "Thanks! Getting toasty! A little warmer please\n" : "No! I need to warm up now!";
      } else if(warmth < 50 && warmth >= 20){
        statusMsg += input ? "Oh thank goodness! I needed that! A little warmer please!\n" : "Oh no, you’re freezing me!";
      }
    
      if (warmth <= 10) {
        statusMsg += "I froze to death. Try again?\n";
        action = "death";
      } else if (warmth >= 90) {
        statusMsg += "Oh no, you cooked me! Try again?";
        action = "death";
      }
  }
}