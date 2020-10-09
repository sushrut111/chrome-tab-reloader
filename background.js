chrome.browserAction.setBadgeText({ text: "OFF" });
chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });
let reloads_holder = {};

chrome.storage.onChanged.addListener((whatchanged, area) => {
  if (area === "local") {
    let keys = Object.keys(whatchanged);
    keys.forEach((element) => {
      if (whatchanged[element].newValue) {
        reloads_holder[element] = setInterval(() => {
          chrome.tabs.reload(parseInt(element));
        }, 10000);
      } else {
        clearInterval(reloads_holder[element]);
      }
    });
  }
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    let tab = tabs[0];
    chrome.storage.local.get(tab.id.toString(), (items) => {
      if (items[tab.id]) {
        chrome.browserAction.setBadgeText({ text: "ON" });
      } else {
        chrome.browserAction.setBadgeText({ text: "OFF" });
      }
    });
  });
});

var tabId = 0;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  tabId = tabId;
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  chrome.storage.local.remove(tabId.toString(), () => {
    console.log("Item removed", tabId);
    //can check the local storage: id is removed
    chrome.storage.local.get(null, function (data) {
      console.info(data);
    });
  });
});
