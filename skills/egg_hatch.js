var bot_icons = {
  chicken: 'http://d2trtkcohkrm90.cloudfront.net/images/emoji/apple/ios-10/256/front-facing-baby-chick.png', 
  snake: '', 
  turtle: '', 
  lizard: '', 
  shrimp: ''
}

module.exports = function(controller) {
  controller.on("egg_hatch", function(bot, message, type) {
    var board = setUpBoard();
    
    var emoji = bot_icons[type];
    
    
  });
};

function setUpBoard() {
  var board;
  for (var x = 0; x < 16; x++) {
    if (x < 9) {
      if (x % 2 == 0) 
        board += ":white_large_square:";
      else 
        board += ":black_large_square:";
    } else {
      if (x % 2 == 0) 
        board += ":black_large_square:";
      else 
        board += ":white_large_square:";
    }
  }
  
  board += board + board + board;
  
  return board;
}