/*  only this works */
document.getElementById('save').onclick = saveHandle;


// fetch handles stored bg.
chrome.runtime.sendMessage({
  message:"send_saved_handles"
},function(response){
  if(response.message ==='no_stored_handles'){
    //display null
    document.getElementById('haveHandle').innerHTML='no saved handles or keywords';
  }
  if(response.message === 'got_saved_handles'){
    var handles =   response.handles;
    var keywords =  response.keywords;
    //show them in html
    document.getElementById('haveHandle').innerHTML="your saved handles and keywords";
    document.getElementById('td1').innerHTML = handles;
    document.getElementById('td2').innerHTML = keywords;
  }
});
function makeUL(array){

}

function saveHandle(){
  var handle=document.getElementById('newHandle').value;
  var keyword=document.getElementById('newKeyword').value;
  console.log('saving'+handle);
  chrome.runtime.sendMessage({
    message:"save_new_handle",
    newHandle:handle,
    newKeyword:keyword
  },function(response){
    document.getElementById('backgroundMessage').innerHTML=response.msg;
    location.reload();
  });
  return false;
}
