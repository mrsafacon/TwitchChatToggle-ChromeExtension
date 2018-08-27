var showIcon = { path : {
  "16" : "icons/show16.png",
  "32" : "icons/show32.png"
}};

var hideIcon = { path : {
  "16" : "icons/hide16.png",
  "32" : "icons/hide32.png"
}};

//-----------Dictionary of active tabs, if null chat is hidden

var Tabs = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { //message from content.js (current only 'show chat' button pressed)
    if(request === "button"){
      chrome.browserAction.setIcon(showIcon);
      Tabs[sender.tab.id] = true;
    } else if (request === "state"){
      if(Tabs[sender.tab.id] === true) sendResponse('show');
      else sendResponse('hide');
    }
});

chrome.tabs.onRemoved.addListener(function (id, info){ //tab closed
  delete Tabs[id];
});

chrome.tabs.onActivated.addListener(function (info){ //new tab in focus
  if(Tabs[info.tabId] === true){
    chrome.browserAction.setIcon(showIcon);
  } else {
    chrome.browserAction.setIcon(hideIcon);
  }
});

//--------------Click plugin button to toggle-----------

chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab){
  if(Tabs[tab.id] === true){//currently enabled, lets disable
    delete Tabs[tab.id];
    sendHideChat(tab.id);
  } else {//disabled lets enable
    Tabs[tab.id] = true;
    sendShowChat(tab.id);
  }
}

function sendHideChat(tabID){
  chrome.tabs.sendMessage(tabID, 'hide');
  chrome.browserAction.setIcon(hideIcon);
}

function sendShowChat(tabID){
  chrome.tabs.sendMessage(tabID, 'show');
  chrome.browserAction.setIcon(showIcon);
}
//----------------Hide chat on page load---------------

chrome.tabs.onUpdated.addListener(update);

function update(id, changeInfo, tab){
  console.log(changeInfo);

  if(Tabs[id] === true)sendShowChat(id);
  else sendHideChat(id);


  if(changeInfo.status == "complete" || ( changeInfo.status == null && changeInfo.audible == null)) {

    /*
      status complete works, but for some reason if you visit twitch.tv main page first then navigate
      to a stream page - the chat will load after page is done.. the status.null && changeInfo.audible is a workaround
      for this. it is another update message that is called after the page is complete, but the update changeInfo has no details
      look more into this and fix
    */

  }
}
