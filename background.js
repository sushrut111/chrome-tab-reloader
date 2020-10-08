chrome.browserAction.setBadgeText({ text: "OFF" });
chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });
let reloads_holder = {};

chrome.storage.onChanged.addListener((whatchanged, area) => {
  console.log(area);
  if (area === "local") {
    let keys = Object.keys(whatchanged);
    keys.forEach((element) => {
      console.log(element);
      console.log(whatchanged[element].newValue);

      if (whatchanged[element].newValue) {
        reloads_holder[element] = setInterval(() => {
          chrome.tabs.reload(parseInt(element), () => callback(element));
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

var id = 0;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  id = tabId;
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  console.log("id deleted :", id);
  delete id;
});
