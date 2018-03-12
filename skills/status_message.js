
var statusMsg;
var action;

module.exports = function(controller) {
  
  controller.getStatus = function(type, int, callback) {
    
    console.log(type, int);
    
    action = "";
    statusMsg = "";
    
    switch (type) {
        
      case "warmth":
        getWarmthStatus(int);
        break;
        
      case "hunger":
        getHungerStatus(int);
        break;
        
      case "poop":
        getPoopStatus(int);
        break;
        
    }
    
    callback({ msg: statusMsg, action: action });
    
  }
  
  var getWarmthStatus = function(warmth) {
      statusMsg = 'My current warmth is at ' + warmth + '%!\n';

      if(warmth == 85){
        action = "hatched";
      } 
    
      if (warmth <= 100 && warmth >= 90) {
        statusMsg += "It's getting a little too warm...\n"; 
      } else if(warmth <= 90 && warmth >= 80){
        statusMsg += "You found the sweet spot!\n"; 
      } else if(warmth <= 80 && warmth >= 70){
        statusMsg += "It's chilly but I'm okay.\n"; 
      } else if(warmth < 70 && warmth >= 50){
        statusMsg += "Please turn up the heat now.\n";
      } else if(warmth < 50 && warmth >= 20){
        statusMsg += "Critical I need warmth!!!!\n";
      } else if (warmth > 0) {
        statusMsg += "I'm like a inch from death, dude! SAVE ME!\n";
      } else {
        statusMsg += "S-s-s-so c-c-c-cold. It's too late for me now...\n";
        action = "death";
      }
  }

  var getHungerStatus = function(hunger) {
    statusMsg = 'My current hunger is at ' + hunger + '%!\n';
    
    if (hunger > 100) {
      action = "death";
      statusMsg += "That was way too much food, I've died!\n";
    }

    if(hunger <= 100 && hunger >= 90) {
      action = "full";
      statusMsg += "I'm all full now, thanks!\n"; 
    }
    else if(hunger < 90 && hunger >= 70){
      statusMsg += "Hmm... I think I could use a snack....\n";
    }
    else if(hunger < 70 && hunger >= 30){
      statusMsg += "I'm really, really hungry! Please feed me!\n";
    }
    else if (hunger > 0 && hunger <= 30) {
      statusMsg += "I'm STARVING! FEED ME NOW!\n";
    }
  }

  var getPoopStatus = function(poops) {
    if(poops <= 2) {
      statusMsg = "I poo'd. Please clean it up.\n";
    }
    else if(poops == 3) {
      statusMsg = "I feel sick. Please clean me!\n";
    }
    else if(poops == 4) {
      statusMsg = "This is disgusting! I feel awful! Clean me now!\n";
    }
    else if(poops == 5) {
      action = "death";
      statusMsg = "I died of dysentery.\n";
    }
  }
}