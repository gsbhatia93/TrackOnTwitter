# TrackOnTwitter
Track users or topics on Twitter using Chrome Extension 
This is Chrome Extension that connects to Twitter.com to track any user or topic you might be interested in.It provides 
real time notification as soon as a user tweets or retweets or whenever someone tweets regarding the topic you are following.
This app could help keep updated with Twitter in real time wihtout having to log in and search through the timeline and keywords 
containing tweets user might not be following. Further extension could involve passing this stream to data mining application as this
could serve as valuable data source removing all noise for stable data sets.
 ![Alt text](/notification.png?raw=true "Optional Title")
  
The backend is served using Nodejs server.This server connects to the Twitter Streaming API. The server recieves the 
'handles' and 'keywords' from our Chrome Extension. It request the Twitter Api, filtering bases in our preference.
These preferences can be input into the app by clicking the extension icon and entering fields of choosing.
NodeJs http server responds to XMLHttpRequest from the extension background.js and inturn updates the handles and keywords that it
recieved as POST request parameters. Hence in each cycle parameters are updated if they need to be updated and new tweets are sent as 
notifications. The notifications are clickable opening the twitter url of tweet in a new tab.By clicking on the extension icon 
you can view and update fields.
![Alt text](/2.png?raw=true "Optional Title")
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
A better way woud be have been using Sockets and library like Socket.io is very useful for implementing full duplex 
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
 
  ![Alt text](/5.png?raw=true "Optional Title")
  
  
  
