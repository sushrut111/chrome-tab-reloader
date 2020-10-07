let active = document.getElementById('active');
const reloadInput = document.getElementById('reload-int-input');

// Maintain checked input box if this window has active reload
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  let tab = tabs[0];
  chrome.storage.local.get(tab.id.toString(), (items) => {
      if(items[tab.id]){
          console.log("found!");
          active.checked = true;
      }
  });
});

// Save current window tab to Chrome storage
active.onchange = function(event) {
  if (event.target.checked) {
    
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let tab = tabs[0];
      let storedObj = {};
      storedObj[tab.id] = true;
      chrome.storage.local.set(storedObj);
    });

    chrome.browserAction.setBadgeText({text: 'ON'});

  } else {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let tab = tabs[0];
      let storedObj = {};
      storedObj[tab.id] = false;
      chrome.storage.local.set(storedObj);
    });

    chrome.browserAction.setBadgeText({text: 'OFF'});

  }
}

// Save reload interval parameter to Chrome storage
reloadInput.onchange = function(event) {
  const numInput = parseInt(reloadInput.value);
  chrome.storage.local.set({ input: numInput });
}