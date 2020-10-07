chrome.browserAction.setBadgeText({text: 'OFF'});
chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
let reloads_holder = {};

chrome.storage.onChanged.addListener((whatchanged, area) => {
    const currentKey = Object.keys(whatchanged)[0];
    const currentVal = whatchanged[currentKey].newValue;
    if(area === "local" && typeof currentVal === 'boolean' ) {
        chrome.storage.local.get('input', (result) => {
            if (currentVal) {
                // Start reloading current tab
                reloads_holder[currentKey] = setInterval(()=>{
                    chrome.tabs.reload(parseInt(currentKey));
                }, result.input * 1000);
            } else {
                // Stop reloading
                clearInterval(reloads_holder[currentKey]);
            }
        });
    }
});

chrome.tabs.onActivated.addListener(()=>{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        let tab = tabs[0];
        chrome.storage.local.get(tab.id.toString(), (items) => {
            if (items[tab.id]) {
                chrome.browserAction.setBadgeText({ text: 'ON' });
            } else {
                chrome.browserAction.setBadgeText({ text: 'OFF' });
            }
        });
      });
});
