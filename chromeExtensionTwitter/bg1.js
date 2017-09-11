// background.js
var handles=[];
var keywords=[];

var NoHandleMessage="no_stored_handles"; //may be at starting up
var SavedHandleMessage = "got_saved_handles";
console.log('starting bg.js');
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "life.html";
    chrome.tabs.create({ url: newURL });
});
function getStoredHandles(){
  chrome.storage.sync.get(["Handles"], function(items){
    if(items.Handles===undefined){
      // first time starting up
      // may be the item not put here
      console.log('item undefined')
    }
    else {

        handleMessage = 'your_stored_handles';
        for(i =0;i<items.Handles.length;i++){
          handles.push(items.Handles[i]);
            console.log(' have ur item '+items.Handles[i])
        }
    }
  });
}
function getStoredKeywords(){
  chrome.storage.sync.get(["Keywords"], function(items){
        if( items.Keywords === undefined){
          // first time starting up
          // may be the item not put here
          console.log('item undefined')
        }
        else {
            console.log(' have ur item '+items.Keywords[0])
            for(i =0;i<items.Keywords.length;i++){
              keywords.push(items.Keywords[i]);
            }

        }

  });

}
getStoredHandles();
getStoredKeywords();

// get saved handles
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('recieved request for data');
    if( request.message === "send_saved_handles" ) {
      var message=null;
      if(handles.length<=0  && keywords.length<=0){
        message=NoHandleMessage;
      }
      else{
        message=SavedHandleMessage;
      }
        sendResponse({
          message:message,
          handles:handles,
          keywords:keywords
        });

    }
  }
);


//save new handle
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "save_new_handle" ) {
      var newHandle = request.newHandle;
      var newKeyword = request.newKeyword;
      if(newHandle !== ""){
        handles.push(newHandle);
        chrome.storage.sync.set({"Handles":handles});
      }
      if(newKeyword !== ""){
        keywords.push(newKeyword);
        chrome.storage.sync.set({"Keywords":keywords});
      }
      sendResponse({msg:"new handle saved"})

    }
  }
);

setInterval(getNewTweets,9000);
function getNewTweets(){
  var xhr = new XMLHttpRequest();
  var url = 'http://localhost:3000'
  xhr.open('POST',url,true);
  xhr.onreadystatechange = handleStateChange;
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var params = '';
  for(i=0;i<handles.length;i++){
        params +='handle=';
        params += handles[i];
        params += '&'
  }
  for(i=0;i<keywords.length;i++){
        params +='keyword=';
        params += keywords[i];
        params += '&'
  }

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
