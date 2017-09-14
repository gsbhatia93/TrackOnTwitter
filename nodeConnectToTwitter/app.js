var http = require('http');
var Twitter = require('twitter');
var fs = require('fs');
var json=[];
var qs = require('querystring');
var track=''; // keywords
var follow= []; // handles have to be passed to ids
var haveId=[];

var followId=[];
//375238248
var client = new Twitter({
    consumer_key : "8ooBn00FUdiNE0FAmgWhBwfuU",
    consumer_secret : "YFlX8EokGjES8Z1fwDu6Spt8KxXXI0eGCRzuD2VD301CZNidN5",
    access_token_key : "375238248-g8W01qhagZ1dyjdxiwj8ZJ6q7LhkAZOtlcoH01qC",
    access_token_secret : "tr3Erq3eyE1C35s5Dh0wgNspPvVM8X557flZdmePIhTuZ"
  });
api();
  //var response=undefined;
var server = http.createServer(function(req,response){
  if(req.method=='POST') {

           var body='';
           req.on('data', function (data) {
               body +=data;
           });
           req.on('end',function(){
               var POST =  qs.parse(body);
               console.log(typeof POST.handle)
               if(typeof POST.handle === 'string'){
                 console.log("follow:"+follow);
                 if(follow.includes(POST.handle) === false){
                    follow.push(POST.handle)
                  }
                 //follow.add(POST.handle);
               }
               if(typeof POST.handle === 'object'){
                 console.log("follow_object:"+follow)
                 follow = POST.handle;
               }
               if(POST.keyword !== undefined){
                 //console.log('setting up track-----');
                 track = POST.keyword;
               }


               api();
               sendres(response);
               if(follow!==undefined && follow.length>0){
                 getId();
               }
               //sendres(response);
         });

   }

}).listen(3000);

function getId(){
  console.log('getting ids-----');
  for(i=0;i<follow.length;i++){
    if(haveId.indexOf(follow[i])==-1){
        getIdFromTwitter(follow[i]);
    }
  }
}

function sendres(response){

  response.writeHead(200, {"Content-Type": "application/json"});
  var objToJson = { };
  objToJson.response = json;
  json=[];
  response.write(JSON.stringify(objToJson));
  response.end(function(){


  });
}

function api(){

  //console.log('twitter api-----'+ typeof track);
  if(track !== '' || followId.length>0){
      //console.log('twitter api--- values--'+  followId);
        client.stream('statuses/filter',{
              track:track.toString(),
              follow:followId.toString()
            },function(stream) {
                stream.on('data', function(event) {
                  console.log(event.text );
                  notify(event);
                });

                stream.on('error', function(error) {
                  console.log(error);
                });

          });

    }

  //  gets json data sends data notification to browser
  function notify(data){
    json.push(data)
    //console.log(json)
  }

}
function getIdFromTwitter(sn){

  client.get('users/lookup',{screen_name:sn},
  function(err,tweet,response){
    if(err){
      return ;
    }

    var id  = tweet[0].id_str
    followId.push(id);
    haveId.push(sn);
    console.log('id got '+id)
  });
}
