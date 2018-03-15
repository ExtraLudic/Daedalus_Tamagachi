module.exports = function(controller) {
  controller.on("team_join", function() {
    console.log("caught that person joinging");
    
  });
}