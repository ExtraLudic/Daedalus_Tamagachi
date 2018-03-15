const _ = require("underscore");
const randomEmoji = require("random-emoji");

var bot_icons = {
  chicken: ':hatched_chick:', 
  snake: ':snake:', 
  turtle: '', 
  lizard: '', 
  shrimp: ''
}

var food_icons = {
  chicken: ':corn:', 
  snake: ':mouse:', 
  turtle: '', 
  lizard: '', 
  shrimp: ''
}

var positions = {
  chicken: { creature: 36, food: [12, 43] }
}

module.exports = function(controller) {
  controller.on("egg_hatched", function(bot, message, type) {
    var board = setUpBoard(type);
            
    var text = "";
    
    for (var x = 0; x <= board.length; x++) {
      var tile = board[x];
      
      if (tile)
        text += tile;
    };
    
    controller.studio.get(bot, "board", message.user, message.channel).then(function(convo) {
      
      convo.threads.default[0].text = "Use the buttons to get me to the food! If you move me off the board I will die and you will have to start over. When I get to the food, I’ll evolve!\n";
      convo.threads.default[0].text += text;
      
      _.each(convo.threads.default[0].attachments[0].actions, function(btn) {
        btn.text = randomEmoji.random({count: 1})[0].character;
      });
      
      convo.activate();
    });
      
  });
};

function setUpBoard(type) {
  var partialBoard = [];
  var board = [];
  
  var white = ":white_large_square:";
  var black = ":black_large_square:";
      
  var emoji = bot_icons[type];
  var foodMoji = food_icons[type];

  var creaturePos = positions[type].creature;
  var foodPos = positions[type].food;
  
  for (var x = 0; x < 8; x++) {
    if (x % 2 == 0 || x == 0) 
      partialBoard.push(white);
    else
      partialBoard.push(black);
    
    if (x == 7)
      partialBoard[7] += "\n";
  }
  
  for (var x = 0; x < 8; x++) {
    if (x % 2 == 0 || x == 0) 
      partialBoard.push(black);
    else
      partialBoard.push(white);

    if (x == 7)
      partialBoard[15] += "\n";
  }
    
  for (var x = 0; x < 4; x++) {
    _.each(partialBoard, function(tile) {
      board.push(tile);
    });
  }
  
  board[creaturePos] = emoji;

  _.each(foodPos, function(pos) {
    board[pos] = foodMoji;
  });
  
  return board;
}