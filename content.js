var chats; //chat log <div> object(s)
var button; //our "show chat button", gets removed when chat gets redrawn
var x = 0; // 0 = hidden ; 1 = shown;

var SHOW_STATE = false;

//---------------------------- Message from plugin ----------

chrome.runtime.onMessage.addListener(messageCallback);

function messageCallback(message, sender, sendResponse){
  init();

  if(message ==='show'){
    show();
  } else  if (message === 'hide'){
    hide();
  }

}

function update(){

  //chat was redrawn by twitch, reassign our references
  chats = document.querySelectorAll('[role="log"]');
  button = document.getElementById('twitch-chat-toggle');
  if( button == null) createButton();

  if(x === 0){
    hide();
  } // else show();
}

function createButton(){
  button = document.createElement("BUTTON");
  var t = document.createTextNode("Show Chat");
  button.appendChild(t);
  button.id  = 'twitch-chat-toggle';
  button.onclick = showButtonPressed;
  if(chats !== null){
    chats.forEach(function (el){
      el.parentNode.insertBefore(button, el.nextSibling);
    });
  }

}

function showButtonPressed(){
  chrome.runtime.sendMessage("button");
  show();
}

init();


function init(){

  chats = document.querySelectorAll('[role="log"]');
  if(chats.length > 0){
    button = document.getElementById("twitch-chat-toggle");
    if(button == null) createButton();
    chats.forEach(function (el){
      el.parentNode.insertBefore(button, el.nextSibling);
    });
  }

  chrome.runtime.sendMessage("state", function(response){
    if(response === 'show'){
      show();
    } else {
      hide();
    }
  });
}

function hide(){

  chats.forEach(function (el){
    el.classList.add("hide");
    x = 0;
  });
  button.classList.remove("hide");
}

function show(){
  SHOW_STATE = true;
  chats.forEach(function (el){
    el.classList.remove("hide");
    x = 1;
  });
  button.classList.add("hide");
}
