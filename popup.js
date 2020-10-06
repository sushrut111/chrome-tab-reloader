let active = document.getElementById('active');

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  let tab = tabs[0];
  chrome.storage.local.get(tab.id.toString(), (items) => {
      if(items[tab.id]){
          console.log("found!");
          active.checked = true;
          
      }
  });
});

active.onchange = function(event) {
  if(event.target.checked){
    let interval = 10000;
    
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log(tabs[0]);
      let tab = tabs[0];
      let tostore = {};
      tostore[tab.id] = true;
      chrome.storage.local.set(tostore);
    });
    chrome.browserAction.setBadgeText({text: 'ON'});
    
  }
  else{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log(tabs[0]);
      let tab = tabs[0];
      let tostore = {};
      tostore[tab.id] = false;
      chrome.storage.local.set(tostore);
    });
    chrome.browserAction.setBadgeText({text: 'OFF'});
  }
}