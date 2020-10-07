const active = document.getElementById('active');
const reloadInput = document.getElementById('reload-int-input');

// Maintain checked input box if this window has active reload
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  let tab = tabs[0];
  chrome.storage.local.get(tab.id.toString(), (items) => {
    // Load reload interval if previously inputted. Otherwise, default value is 10 seconds
    if (items[tab.id]) {
      reloadInput.value = items[tab.id].input ? items[tab.id].input : 10;
    }

    // Check off checkbox if currently reloading
    if(items[tab.id] && items[tab.id].active){
        active.checked = true;
    }
  });
});

// Save current window tab to Chrome storage
active.onchange = function(event) {
  // Save reload interval parameter to Chrome storage
  const numInput = parseInt(reloadInput.value);

  if (event.target.checked) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let tab = tabs[0];
      let storedObj = {};
      storedObj[tab.id] = {
        active: true,
        input: numInput
      };
      chrome.storage.local.set(storedObj);
    });

    chrome.browserAction.setBadgeText({text: 'ON'});

  } else {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let tab = tabs[0];
      let storedObj = {};
      storedObj[tab.id] = {
        active: false,
        input: numInput
      };
      chrome.storage.local.set(storedObj);
    });

    chrome.browserAction.setBadgeText({text: 'OFF'});

  }
}