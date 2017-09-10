// code for connecting to nodejs
// send XMLHttpRequest
var handles=[];
var keywords=[];
//chrome.extension.getBackgroundPage().handles = handles
setInterval(getStoredData,3000);
function getStoredData(){
  // fetch handles stored bg.
  chrome.runtime.sendMessage({
    message:"send_saved_handles"
  },function(response){
    if(response.message ==='no_stored_handles'){
      //display null
    }
    if(response.message === 'got_saved_handles'){
      var handles =   response.handles;
      var keywords =  response.keywords;
      //show them in html
      }
  });

}

function getNewTweets(){
  var xhr = new XMLHttpRequest();
  var url = 'http://localhost:3000'
  xhr.open('POST',url,true);
  xhr.onreadystatechange = handleStateChange;
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var params = "name=binny&name=asas&name=asdasd";
  xhr.send(params);

  function handleStateChange(){
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      console.log(typeof xhr.responseText);
      var r  = JSON.parse(xhr.responseText)

      if(r.response.length>0){
        console.log(r.response[0]);
        for(i=1;i<r.response.length;i++){
          console.log(r.response[i].id);
          showNotification(r.response[i])
        }
      }
      else{
        console.log("no new tweet")
      }
    }
  }
}
//setInterval(getNewTweets,9000);
//getNewTweets();


function showNotification(msg) {
  var id = msg.id_str;
  var options = {
    type:"basic",
    title:msg.user.name,
    message:msg.text,
    iconUrl:"icon.png"
  };
  //notification options set
  chrome.notifications.create(id.toString(),options,callback);
  function forwardNotfy(){
      chrome.notifications.clear(id.toString());
      window.open("https:twitter.com/statuses/"+id); //optional
   }

   chrome.notifications.onClicked.addListener(forwardNotfy);
   function callback() {
     console.log("Notification succesfull "+id);
     //notification confirmed
   }
}
