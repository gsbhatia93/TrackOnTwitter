# TrackOnTwitter
Track users or topics on Twitter using Chrome Extension 
This is Chrome Extension that connects to Twitter.com to track any user or topic you might be interested in.It provides 
real time notification as soon as a user tweets or retweets or whenever someone tweets regarding the topic you are following.Set the fields you want to follow by clicking the extension icon on the right hand corner of menu bar.It opens a new page where you can view already set fields and enter new ones. 
This app could help keep updated with Twitter in real time wihtout having to log in and search through the timeline and keywords 
containing tweets user might not be following. Further extension could involve passing this stream to data mining application as this
could serve as valuable data source removing all noise for stable data sets.
 ![Alt text](/notification.png?raw=true "notification and fields")
  
The backend is served using Nodejs server.This server connects to the Twitter Streaming API. The server recieves the 
'handles' and 'keywords' from our Chrome Extension. It request the Twitter Api, filtering bases in our preference.
These preferences can be input into the app by clicking the extension icon and entering fields of choosing.
NodeJs http server responds to XMLHttpRequest from the extension background.js and inturn updates the handles and keywords that it
recieved as POST request parameters. Hence in each cycle parameters are updated if they need to be updated and new tweets are sent as 
notifications. The notifications are clickable opening the twitter url of tweet in a new tab.By clicking on the extension icon 
you can view and update fields.
![Alt text](/2.png?raw=true "open notification in new tab")
Create a new XMLHttpRequest and send to server requesting new tweets. 
```
setInterval(getNewTweets,3000);
function getNewTweets(){
  var xhr = new XMLHttpRequest();
  var url = 'http://localhost:3000'
  xhr.open('POST',url,true);
  xhr.onreadystatechange = handleStateChange;
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(params);
  ...
```
A better way woud be have been using Sockets and library like Socket.io, very useful for implementing full duplex 
communication channel. My implementation relies on polling the backend server.

For OUATH with Twitter, a prerequisite for Twitter Streaming API, in NodeJS I have used <a href='https://www.npmjs.com/package/twitter'>Twitter package.</a>
```
var Twitter = require('Twitter');
var client = new Twitter({
    consumer_key : "********",
    consumer_secret : "***********",
    access_token_key : "**********",
    access_token_secret : "************"
  });
  
  ```
 
  ![Alt text](/5.png?raw=true )
  Due to this reason I used NodeJs to make connection with the Twitter Streaming API. 
  ```
  client.stream('statuses/filter',{
              track:track.toString(),
              follow:followId.toString()
            },function(stream) {
                // do something with this stream of data
            }
  ```
  This app is limited by the rate limitations imposed by Twitter and if you make set intervals for polling to frequent you will start hitting error codes 420, which means streaming server want you to slow down. It is also limited by the number of users you can follow. You can track 400 keywords and 5000 users. Another call to Twitter Api had be made to fetch user id. As the extension takes as input only screen names of people you follow but twitter api for streaming expects user id, they had to be fetched by a REST call to users/lookup.
 ```
client.get('users/lookup',{screen_name:sn},
  function(err,tweet,response){
     ...
  }
 ```
  
  At the browser extension utilize the Chrome Storage mechanism for storing the handles and keyword.
  ```
    chrome.storage.sync.set({"Handles":handles});
    
    chrome.storage.sync.get(["Handles"], function(items){
      // use the items fetched
    }
  ```
Chrome storage is better than locale.storage as it provides sync across chrome account helping transfering fields you have saved.
<hr>
<h4>Node setup</h4>
Required : twitter package<br>
command  : npm install twitter --save<br>
To start the server go to root directory containing app.js : node app.js

  
