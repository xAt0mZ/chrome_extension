'use strict';

const apiUrl = "http://localhost:3000/status/";
const streamer = 'armatvhs';
const streamerUrl = 'https://www.twitch.tv/kennystream';

function notifyClient(res) {
  chrome.notifications.create("streamerLive", {
    type: 'basic',
    iconUrl: 'icons/ext_icon48.png',
    title: 'KennyStream EST LIVE !',
    message: "Je viens de lancer mon live, rejoins moi en cliquant ici !",
    requireInteraction: true
  });
}


function actionsOnStreamerLive(res) {
  if (Object.keys(res).length !== 0) { // streamer is online
    chrome.browserAction.setIcon({ path: 'icons/kenz_on.png' })
    getDismiss(function (item) {
      if (item.dismiss == false)
        notifyClient(item);
    });
  } else {
    chrome.browserAction.setIcon({ path: 'icons/kenz_off.png' })
    setDismiss(false);
  }
}

function getStreamerStatus() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl + streamer, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var res = JSON.parse(xhr.responseText);
      actionsOnStreamerLive(res);
    }
  }
  xhr.send();
}

// action on each tick
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "retrieveStatus") {
    getStreamerStatus();
  }
});

chrome.notifications.onClosed.addListener(function () {
  setDismiss(true);
});

chrome.notifications.onClicked.addListener(function () {
  chrome.tabs.create({ url: streamerUrl });
  chrome.notifications.clear("streamerLive");
  setDismiss(true);
});

// creates the retrieve timer
chrome.alarms.create("retrieveStatus", {
  delayInMinutes: 1,
  periodInMinutes: 1
});

setDismiss(false);


// dismis functions
function getDismiss(callback) {
  chrome.storage.local.get(['dismiss'], callback);
}

function setDismiss(value) {
  chrome.storage.local.set({ dismiss: value });
}
