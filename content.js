var chats; //chat log <div> object(s)
var button; //our "show chat button", gets removed when chat gets redrawn
var x = 0; // 0 = hidden ; 1 = shown;

//---------------------------- Message from plugin ----------

chrome.runtime.onMessage.addListener(messageCallback);

function messageCallback(message, sender, sendResponse){
  if(message.id === 0){
    x=0;
    update();
  } else if(message.id === 1){
    toggle();
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
  button.onclick = toggle;

  chats.forEach(function (el){
    el.parentNode.insertBefore(button, el.nextSibling);
  });
}

init();

function toggle(){
  if(x == 0)show();
  else hide();
}


function init(){
  if(chats !== null){
    createButton();
    chats.forEach(function (el){
      el.parentNode.insertBefore(button, el.nextSibling);
    });
  }
  hide();
}

function hide(){
  chats.forEach(function (el){
    el.classList.add("hide");
    x = 0;
  });
  button.classList.remove("hide");
}

function show(){
  chats.forEach(function (el){
    el.classList.remove("hide");
    x = 1;
  });
  button.classList.add("hide");
}
