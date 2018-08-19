

//--------------Click plugin button to toggle-----------

chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab){
  var message = {
    id : 1, //toggle
  }
  chrome.tabs.sendMessage(tab.id, message);
}


//----------------Hide chat on page load---------------

chrome.tabs.onUpdated.addListener(update);

function update(id, changeInfo, tab){
  console.log(changeInfo);

  if(changeInfo.status == "complete" || ( changeInfo.status == null && changeInfo.audible == null)) {
    /*
      status complete works, but for some reason if you visit twitch.tv main page first then navigate
      to a stream page - the chat will load after page is done.. the status.null && changeInfo.audible is a workaround
      for this. it is another update message that is called after the page is complete, but the update changeInfo has no details
      look more into this and fix
    */
    var message = {
      id : 0, //force hide
    }
    chrome.tabs.sendMessage(id, message);
  }
}
