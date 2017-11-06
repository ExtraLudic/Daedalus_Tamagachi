`npm botkit google --save`

    'use strict';
    var Botkit = require('botkit');
    var google = require('google');

    var controller = Botkit.slackbot({
        debug: false
    });

    // connect the bot to a stream of messages
    controller.spawn({
       token: '<insert here>',
    }).startRTM();

    controller.hears('hello',    ['direct_message','direct_mention','mention'],function(bot,message) {
        bot.reply(message,'Hello yourself.');
    });