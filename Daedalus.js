var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();
var port = process.env.PORT || 1337;
var warmth = 50;
 
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get('/', function (req, res) { res.status(200).send('Hello world!'); });
 
app.listen(port, function () {
  console.log('Listening on port ' + port);
});

app.post('/hello', function (req, res, next) {
  var userName = req.body.user_name;
  var botPayload = {
    text : 'Hello ' + userName + ", welcome to the Daedalus ARG! I'm Daedalus, and I'll be your host!"
  };

  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});
app.post('/:sunny:', function (req, res, next) {
  var userName = req.body.user_name;
  if(warmth < 100) {
    warmth += 5;
  }
  else {
    wamth = 100;
  }
  var botPayload = {
    text : 'Yum! Thanks, ' + userName + "! My wamth is now at " + warmth + '%!'
  };

  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});