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
        postMessage(request.text.replace("/define ", ""));
      this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(word) {
  try{
    var botResponse, options, body, botReq;
    botresponse = "error";
    trollface = urban(word);
    trollface.first(function(json) {
      if(typeof json == "undefined"){
        console.log(typeof json);
        sendDef("No definition found");
      }
      else{
      console.log(typeof json);
      console.log(json.definition);
      sendDef(json.definition);
    }
    });
  }catch(ex){
    sendDef("No definition found");
  }
}

function sendDef(botResponse){
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
