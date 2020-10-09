const active = document.getElementById('active');
const activeLabel = document.getElementById('on-switch-label');
const intervalSlider = document.getElementById('reload-int-input');
const intervalDisplay = document.getElementById('reload-int-display');
const settingsContainer = document.getElementById('settings-container');
const seconds = document.getElementById('sec');
const minutes = document.getElementById('min');

// Maintain checked input box if this window has active reload
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  let tab = tabs[0];
  chrome.storage.local.get(tab.id.toString(), (items) => {
    // Load previous user input settings
    if (items[tab.id]) {
      // Load unit check box
      if (items[tab.id].unit === 'min') {
        minutes.checked = true;
      } else {
        seconds.checked = true;
      }

      // Load Interval display
      intervalDisplay.innerHTML = items[tab.id].input;
      intervalSlider.value = items[tab.id].input;
    }

    // Check off checkbox if currently reloading
    if(items[tab.id] && items[tab.id].active){
        active.checked = true;
        activeLabel.innerHTML = 'ON';
    }
  });
});

// Save current window tab to Chrome storage
active.onchange = function(event) {
  // Save reload interval parameter to Chrome storage
  let numInput = parseInt(intervalSlider.value);
  // Toggle to minutes if the option was selected
  let unitInput = minutes.checked ? 'min' : 'sec';

  // Turn ON
  if (event.target.checked) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let tab = tabs[0];
      let storedObj = {};
      storedObj[tab.id] = {
        active: true,
        input: numInput,
        unit: unitInput
      };
      chrome.storage.local.set(storedObj);
    });

    activeLabel.innerHTML = 'ON';
    settingsContainer.classList.add('disabled');
    chrome.browserAction.setBadgeText({text: 'ON'});

  // Turn OFF
  } else {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let tab = tabs[0];
      let storedObj = {};
      storedObj[tab.id] = {
        active: false,
        input: numInput,
        unit: unitInput
      };
      chrome.storage.local.set(storedObj);
    });

    activeLabel.innerHTML = 'OFF';
    settingsContainer.classList.remove('disabled');
    chrome.browserAction.setBadgeText({text: 'OFF'});

  }
}

// Update interval display
intervalSlider.oninput = function() {
  intervalDisplay.innerHTML = intervalSlider.value;
}
