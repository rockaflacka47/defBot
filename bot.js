var HTTPS = require('https');
var urban = require('urban');
var sleep = require('sleep');
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/define /;
      console.log("\n\n" + request.name);
      console.log(request.sender_id);
  if(request.text && botRegex.test(request.text) && request.name != "devBot") {
      this.res.writeHead(200);
      if(request.sender_id != 22774873){
        postMessage(0, request.text.replace("/define ", ""));
      }else {
        postMessage(1, "null");
      }
      this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(resNum, word) {
  var botResponse, options, body, botReq;
  botresponse = "error";
  if(resNum == 0){
    trollface = urban(word);

    trollface.first(function(json) {
    console.log(json.definition);
    botResponse = json.definition;
    });

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

  while(botResponse === undefined){
    console.log("bum");
    sleep.sleep(1);
  }
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
