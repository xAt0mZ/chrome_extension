'use strict';

const apiUrl = "http://localhost:3000/status/";
const streamer = 'armatvhs';
const streamerUrl = 'https://www.twitch.tv/kennystream';

function notifyClient(res) {
  browser.notifications.create("streamerLive", {
    type: 'basic',
    iconUrl: 'icons/ext_icon48.png',
    title: 'KennyStream EST LIVE !',
    message: "Je viens de lancer mon live, rejoins moi en cliquant ici !"
  });

  var myAudio = new Audio("audios/notification.mp3");
  myAudio.play();
}


function actionsOnStreamerLive(res) {
  if (Object.keys(res).length !== 0) { // streamer is online
    browser.browserAction.setIcon({ path: 'icons/kenz_on.png' })
    getDismiss(function (item) {
      if (item.dismiss == false)
        notifyClient(item);
    });
  } else { // reset dismiss when streamer turns offline
    browser.browserAction.setIcon({ path: 'icons/kenz_off.png' })
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
browser.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "retrieveStatus") {
    getStreamerStatus();
  }
});

browser.notifications.onClosed.addListener(function () {
  setDismiss(true);
});

browser.notifications.onClicked.addListener(function () {
  browser.tabs.create({ url: streamerUrl });
  browser.notifications.clear("streamerLive");
  setDismiss(true);
});

// creates the retrieve timer
browser.alarms.create("retrieveStatus", {
  delayInMinutes: 1,
  periodInMinutes: 1
});


browser.runtime.onInstalled.addListener(function () {
  getDismiss(function (item) {
    if (item.dismiss === null || item.dismiss === undefined)
      setDismiss(false);
      browser.browserAction.setIcon({ path: 'icons/kenz_off.png' })
    
  })
})



function getDismiss(callback) {
  browser.storage.local.get(['dismiss'], callback);
}

function setDismiss(value) {
  browser.storage.local.set({ dismiss: value });
}