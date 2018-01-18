var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();
var port = process.env.PORT || 1337;
var warmth = 0;
var hunger = 0;
var statusTime = 1000;
var hatchedstatusTime = 1000;
var progress = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"];
var hungermeter = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"];
var poopmeter = [":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:", ":red_circle:"]

var eggemoji = "http://vanguardseattle.com/wp-content/uploads/2016/05/egg-emoji-unicode.jpg";
var daedalusemoji = "https://avatars.slack-edge.com/2017-11-08/269162770516_e2c4553016a99b14da83_72.png";
var chickemoji = "http://d2trtkcohkrm90.cloudfront.net/images/emoji/apple/ios-10/256/front-facing-baby-chick.png";
var skullemoji = "https://www.emojibase.com/resources/img/emojis/apple/x1f480.png.pagespeed.ic.sgphl_7Fk3.png";
var hatchedCount = 0;
var winCount = 0;
var poopCount = 0;
var poops = 0;
var bottestingid = 'C7WLECZAR';
var tamagachichannelid = "C7TBXMMQ8";
var started = false;
var gameover = false;
var hatched = false;

var Botkit = require('botkit');

var controller = Botkit.slackbot({
  json_file_store: './db_slackbutton_bot/',
  interactive_replies: true,
  debug: true,
  require_delivery: true
}).configureSlackApp({
    clientId: "284487422181.283793397088",
    clientSecret: 'e0409faa585e9ac36722fd5be19125c1',
    scopes: ['commands', 'bot'],
});;

controller.setupWebserver((port), function(err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function(err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });

    // If not also opening an RTM connection
    controller.startTicking();
});

var bot = controller.spawn({

  token: "xoxb-283934994183-t5aMRUyi3tReh0qjdJDCH793"

})

bot.startRTM(function(err,bot,payload) {

  bot.say(
        {
        username: 'Daedalus',
        text: "Hey there, player! Welcome to the Tamagachi minigame! To get started, type 'New Tamagachi'!",
        channel: tamagachichannelid,
        icon_url: daedalusemoji
        }
        );
  if (err) {

    throw new Error('Could not connect to Slack');

  }

});

controller.hears(["New Tamagachi"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
	hatched = false;
	gameover = false;
	started = true;
    if(warmth <= 0 || warmth > 100) {
        warmth = 50;
        bot.say(
        {
        username: 'Tamagachi',
        text: "I'm an egg. Keep me warm to hatch me.",
        channel: tamagachichannelid,
        icon_url: eggemoji
        }
        );
        var eggintervalID = setInterval(
    function(){
    if(statusTime > 0) {
        statusTime -= 1;
    }
    else{
        var statusMsg = "";
        if(warmth > 0 && warmth <= 100) {
            warmth -= 5;
        }
        else if(warmth < 0){
            warmth = 0;
        }
        for(var x = 0; x < warmth/5; x++){
            progress[x] = ":white_check_mark:";
        }
        for(var x = warmth/5; x < 20; x++){
            progress[x] = ":red_circle:";
        }
        var statusMsg = 'My current warmth is at ' + warmth + '%!\n';
        if(warmth <= 90 && warmth >= 70){
            hatchedCount += 1;
        }
        if(warmth <= 100 && warmth >= 80){
            statusMsg += "It's chilly but I'm okay.\n"; 
        }
        else if(warmth < 80 && warmth >= 50){
            statusMsg += "Please turn up the heat now.\n";
        }
        else if(warmth < 50 && warmth >= 20){
            statusMsg += "Critical I need warmth!!!!\n";
        }
        else {
            statusMsg += "I'm like a inch from death, dude! SAVE ME!\n";
        }
        if(hatchedCount >= 5) {
            hunger = 80;
            hatched = true;
            bot.say(
                {
                username: 'Tamagachi',
                text: "I hatched! I'm a weird chicken thing now! Please help me stay alive. If you do a good job, I will reward you with something great!",
                channel: tamagachichannelid,
                icon_url: chickemoji
                });
            clearInterval(eggintervalID);
            var chickintervalID = setInterval(function() {
            	if(statusTime > 0){
            		statusTime -= 1;
            	}
            	else {
            		if(warmth > 0 && warmth <= 100) {
			            warmth -= 5;
			        }
			        else if(warmth < 0){
			            warmth = 0;
			        }
			        for(var x = 0; x < warmth/5; x++){
			            progress[x] = ":white_check_mark:";
			        }
			        for(var x = warmth/5; x < 20; x++){
			            progress[x] = ":red_circle:";
			        }
			        var statusMsg = 'My current warmth is at ' + warmth + '%!\n';
			        if(warmth <= 90 && warmth >= 70){
			            hatchedCount += 1;
			        }
			        if(warmth <= 100 && warmth >= 80){
			            statusMsg += "It's chilly but I'm okay.\n"; 
			        }
			        else if(warmth < 80 && warmth >= 50){
			            statusMsg += "Please turn up the heat now.\n";
			        }
			        else if(warmth < 50 && warmth >= 20){
			            statusMsg += "Critical I need warmth!!!!\n";
			        }
			        else {
			            statusMsg += "I'm like a inch from death, dude! SAVE ME!\n";
			        }

			        if(warmth > 0 && warmth <= 100) {
			        for(var y = 0; y < progress.length; y++) {
			            statusMsg += progress[y];
			        }
			        bot.say(
			        {
			         username: 'Tamagachi',
			         text: statusMsg,
			         channel: tamagachichannelid,
			         icon_url: chickemoji
			        });
			        }
			        else if (warmth <= 0 && !gameover) {

			            clearInterval(eggintervalID);
			            bot.say(
			        {
			         username: 'Tamagachi',
			         text: "You lose! To restart, type 'New Tamagachi'!",
			         channel: tamagachichannelid,
			         icon_url: skullemoji
			        });
			            gameover = true;
			            started = false;
			        }
			        statusTime = 3000;
            	}
                if(hatchedstatusTime > 0){
                    hatchedstatusTime -= 1;
                }
                else {
                    if(hunger > 0 && hunger <= 100) {
                        hunger -= 10;
                    }
                    else if(hunger < 0){
                        hunger = 0;
                    }
                    for(var x = 0; x < hunger/10; x++){
                        hungermeter[x] = ":white_check_mark:";
                    }
                    for(var x = hunger/10; x < 10; x++){
                        hungermeter[x] = ":red_circle:";
                    }
                    var hungerstatusMsg = 'My current hunger is at ' + hunger + '%!\n';
                    if(hunger <= 100 && hunger >= 90){
                    	winCount++;
                        hungerstatusMsg += "I'm all full now, thanks!\n"; 
                    }
                    else if(hunger < 90 && hunger >= 70){
                        hungerstatusMsg += "Hmm... I think I could use a snack....\n";
                    }
                    else if(hunger < 70 && hunger >= 30){
                        hungerstatusMsg += "I'm really, really hungry! Please feed me!\n";
                    }
                    else {
                        hungerstatusMsg += "I'm STARVING! FEED ME NOW!\n";
                    }

			        if(winCount >= 10) {
			            clearInterval(chickintervalID);
			            gameover = true;
			            started = false;
			            hatched = false;
			            bot.say(
			                {
			                username: 'Tamagachi',
			                text: "Thanks for helping me thrive! Enjoy this alphanumeric code: sqd09erbs2. To restart, type 'new tamagachi'.",
			                channel: tamagachichannelid,
			                icon_url: chickemoji
			                });
			        }
                    if(hunger > 0 && hunger <= 100){
                        for(var y = 0; y < hungermeter.length; y++){
                            hungerstatusMsg += hungermeter[y];
                        }
                        bot.say(
                        {
                            username: 'Tamagachi',
                            text: hungerstatusMsg,
                            channel: tamagachichannelid,
                            icon_url: chickemoji
                        });
                    }
                    else if(hunger <= 0){
                        clearInterval(chickintervalID);
                        bot.say({
                            username: 'Tamagachi',
                            text: "You lose! To restart, type 'New Tamagachi'!",
                            channel: tamagachichannelid,
                            icon_url: skullemoji
                        });
                    }
                    hatchedstatusTime = 1000;
                }
            }, 5);
        }
        else if(warmth > 0 && warmth <= 100) {
        for(var y = 0; y < progress.length; y++) {
            statusMsg += progress[y];
        }
        bot.say(
        {
         username: 'Tamagachi',
         text: statusMsg,
         channel: tamagachichannelid,
         icon_url: eggemoji
        });
        }
        else if (warmth <= 0 && !gameover) {

            clearInterval(eggintervalID);
            bot.say(
        {
         username: 'Tamagachi',
         text: "You lose! To restart, type 'New Tamagachi'!",
         channel: tamagachichannelid,
         icon_url: skullemoji
        });
            gameover = true;
            started = false;
        }
        statusTime = 1000;
    }
}, 5);
    }
});
controller.hears(["Hello","Hi"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {

  bot.reply(message,'Hello, how are you today?');

});

controller.hears([":sunny:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(gameover == false && started == true) {
  warmth += 5;
  if(warmth > 100) {

    clearInterval(eggintervalID);
    bot.say(
        {
         username: 'Tamagachi',
         text: "I'm cooked! To restart, type 'New Tamagachi'!",
         channel: tamagachichannelid,
         icon_url: skullemoji
        });
  }
  for(var x = 0; x < warmth/5; x++){
    progress[x] = ":white_check_mark:";
  }
  var progressMsg = 'Yum! Thanks! My warmth is now at ' + warmth + '%!\n';
  for(var y = 0; y < progress.length; y++) {
    progressMsg += progress[y];
  }
  if(warmth > 100){
    progressMsg = "";
  }
  if(hatched) {
  	statusTime = 3000;
	        bot.say(
	        {
	         username: 'Tamagachi',
	         text: statusMsg,
	         channel: tamagachichannelid,
	         icon_url: chickemoji
	        });
        }
        else {
        	statusTime = 1000;
	        bot.say(
	        {
	         username: 'Tamagachi',
	         text: statusMsg,
	         channel: tamagachichannelid,
	         icon_url: eggemoji
	        });
        }
});
controller.hears([":mostly_sunny:", ":partly_sunny:", ":barely_sunny:", ":partly_sunny_rain:", ":cloud:", ":rain_cloud:", ":thunder_cloud_and_rain:", ":lightning:", ":zap:", ":snowflake:", ":snow_cloud:", ":tornado:", ":fog:", ":umbrella_with_rain_drops:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(gameover == false && started == true) {
  statusTime = 1000;
  if(warmth > 0) {
    warmth -= 5;
    warmth += 5;
    var statusMsg = "";
        if(warmth > 0 && warmth <= 100) {
            warmth -= 5;
        }
        else if(warmth < 0){
            warmth = 0;
        }
        for(var x = 0; x < warmth/5; x++){
            progress[x] = ":white_check_mark:";
        }
        for(var x = warmth/5; x < 20; x++){
            progress[x] = ":red_circle:";
        }
        var statusMsg = "Ooh! That's colder than I want it to be! My current warmth is at " + warmth + '%!\n';
        if(warmth <= 100 && warmth >= 80){
            statusMsg += "It's chilly but I'm okay.\n"; 
        }
        else if(warmth < 80 && warmth >= 50){
            statusMsg += "Please turn up the heat now.\n";
        }
        else if(warmth < 50 && warmth >= 20){
            statusMsg += "Critical I need warmth!!!!\n";
        }
        else {
            statusMsg += "I'm like a inch from death, dude! SAVE ME!\n";
        }
        if(warmth >= 0 && warmth <= 100) {
        for(var y = 0; y < progress.length; y++) {
            statusMsg += progress[y];
        }
        if(hatched) {
        	statusTime = 3000;
	        bot.say(
	        {
	         username: 'Tamagachi',
	         text: statusMsg,
	         channel: tamagachichannelid,
	         icon_url: chickemoji
	        });
        }
        else {
        	statusTime = 1000;
	        bot.say(
	        {
	         username: 'Tamagachi',
	         text: statusMsg,
	         channel: tamagachichannelid,
	         icon_url: eggemoji
	        });
        }
        }
  }
  else {
    bot.say(
        {
         username: 'Tamagachi',
         text: "You lose! To restart, type 'New Tamagachi'!",
         channel: tamagachichannelid,
         icon_url: skullemoji
        });
        clearInterval(eggintervalID);
        gameover = true;
        started = false;
  }
  
        statusTime = 1000;
    }
});
controller.hears([":green_apple:", ":apple:", ":pear:", ":tangerine:", ":lemon:", ":banana:", ":watermelon:", ":grapes:", ":strawberry:", ":melon:", ":cherries:", ":peach:", ":pinapple:", ":tomato:", ":eggplant:", ":hot_pepper:", ":corn:", ":sweet_potato:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(gameover == false && hatched == true && started == true) {
  hatchedstatusTime = 1000;
  hunger += 10;
  if(hunger > 100) {
    clearInterval(chickintervalID);
    bot.say(
        {
         username: 'Tamagachi',
         text: "Ow, I have a tummy ache! To restart, type 'New Tamagachi'!",
         channel: tamagachichannelid,
         icon_url: skullemoji
        });
  }
  for(var x = 0; x < hunger/10; x++){
    hungermeter[x] = ":white_check_mark:";
  }
  var hungerstatusMsg = 'Yum! Thanks! My hunger is now at ' + hunger + '%!\n';
  for(var y = 0; y < hungermeter.length; y++) {
    hungerstatusMsg += hungermeter[y];
  }
  if(warmth > 100){
    hungerstatusMsg = "";
  }
  bot.say(
        {
         username: 'Tamagachi',
         text: hungerstatusMsg,
         channel: tamagachichannelid,
         icon_url: chickemoji
        });
  poopCount += 1;
  if(poopCount == 3) {
  	poops += 1;
  	for(int x = 0; x < poops; x++) {
  		poopmeter[x] = ":poop:";
  	}
  	var poopStatusMsg
  	if(poops <= 2) {
  		poopStatusMsg = "I poo'd. Please clean it up.\n";
    }
    else if(poops == 3) {
  		poopStatusMsg = "I feel sick. Please clean me!\n";
    }
    else if(poops == 4) {
  		poopStatusMsg = "This is disgusting! I feel awful! Clean me now!\n";
    }
    else if(poops == 5) {
    	clearInterval(chickintervalID);
    	gameover = true;
    	started = false;
  		poopStatusMsg = "I died of dysentary. Type 'New Tamagachi' to restart\n";
    }
    for(int x = 0; x < poopmeter.length; x++) {
    	poopStatusMsg += poopmeter[x];
    }
  	bot.say(
        {
         username: 'Tamagachi',
         text: hungerstatusMsg,
         channel: poopStatusMsg,
         icon_url: chickemoji
        });
  	poops = 0;
  	poopCount = 0;
  	}
	}
});
controller.hears([":honey_pot:", ":bread:", ":cheese_wedge:", ":poultry_leg:", ":meat_on_bone:", ":fried_shrimp:", ":egg:", ":hamburger:", ":fries:", ":hotdog:", ":pizza:", ":spaghetti:", ":taco:", ":burrito:", ":ramen:", ":stew:", ":fish_cake:", ":sushi:", ":bento:", ":curry:", ":rice_ball:", ":rice:", ":rice_cracker:", ":oden:", ":dango:", ":shaved_ice:", ":ice_cream:", ":icecream:", ":cake:", ":birthday:", ":custard:", ":candy:", ":lollipop:", ":chocolate_bar:", ":popcorn:", ":doughnut:", ":cookie:", ":beer:", ":beers:", ":wine_glass:", ":cocktail:", ":tropical_drink:", ":champagne:", ":sake:", ":tea:", ":coffee:", ":baby_bottle:"],function(bot,message) {
   if(gameover == false && hatched == true && started == true) {
  hatchedstatusTime = 1000;
  if(hunger > 0) {
    hunger -= 5;
    hunger += 5;
    var hungerstatusMsg = "Ew! I can't eat that! ";
        if(hunger > 0 && hunger <= 100) {
            hunger -= 10;
        }
        else if(hunger < 0){
            hunger = 0;
        }
        for(var x = 0; x < hunger/10; x++){
            hungermeter[x] = ":white_check_mark:";
        }
        for(var x = hunger/10; x < 10; x++){
            hungermeter[x] = ":red_circle:";
        }
        var hungerstatusMsg = 'My current hunger is at ' + hunger + '%!\n';
        if(hunger <= 100 && hunger >= 90){
            hungerstatusMsg += "I'm all full now, thanks!\n"; 
        }
        else if(hunger < 90 && hunger >= 70){
            hungerstatusMsg += "Hmm... I think I could use a snack....\n";
        }
        else if(hunger < 70 && hunger >= 30){
            hungerstatusMsg += "I'm really, really hungry! Please feed me!\n";
        }
        else {
            hungerstatusMsg += "I'm STARVING! FEED ME NOW!\n";
        }
        if(hunger >= 0 && hunger <= 100) {
        for(var y = 0; y < hungermeter.length; y++) {
            hungerstatusMsg += hungermeter[y];
        }
        bot.say(
        {
         username: 'Tamagachi',
         text: hungerstatusMsg,
         channel: tamagachichannelid,
         icon_url: chickemoji
        });
        }
  }
  else {
    bot.say(
        {
         username: 'Tamagachi',
         text: "You lose! To restart, type 'New Tamagachi'!",
         channel: tamagachichannelid,
         icon_url: skullemoji
        });
        clearInterval(chickintervalID);
        gameover = true;
        started = false;
  }
  
  hatchedstatusTime = 1000;
	}
});

controller.hears([":sweat_drops:", ":droplet:", ":potable_water:", ":ocean:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
	if(poops > 0 && hatched == true) {
	var poopStatusMsg = "";
	poops -= 1;
	for(int x = poopmeter.length - 1; x >= poops; x--) {
    	poopmeter[x] = ":red_circle:";
    }
	for(int x = 0; x < poopmeter.length; x++) {
    	poopStatusMsg += poopmeter[x];
    }
    if(poop == 0) {
    	poopStatusMsg = "All Clean! Thanks!\n" + poopStatusMsg;
    }
    else {
    	poopStatusMsg = "Thanks!\n" + poopStatusMsg;
    }
  	bot.say(
        {
         username: 'Tamagachi',
         text: hungerstatusMsg,
         channel: poopStatusMsg,
         icon_url: chickemoji
        });

	}
});