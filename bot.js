var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /devBot/;
      console.log("\n\n" + request.name);
      console.log(request.sender_id);
  if(request.text && botRegex.test(request.text) && request.name != "devBot") {
      this.res.writeHead(200);
      if(request.sender_id != 22774873){
        postMessage(0);
      }else {
        postMessage(1);
      }
      this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(resNum) {
  var botResponse, options, body, botReq;
  if(resNum == 0){
    botResponse = "Hi dude, I'm devBot. Eventually I'll do stuff but rn I'm sleeping. Night!";
  }
  else{
    botResponse = "STFU DOM, don't tell me what to do!"
  }
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
