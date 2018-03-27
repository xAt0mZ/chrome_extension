'use strict';

const apiUrl = "https://api.kennystream.tv";
var streamInfo = {};

function notifyClient(res) {
  streamInfo = res;
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
        notifyClient(res);
    });
  } else { // reset dismiss when streamer turns offline
    browser.browserAction.setIcon({ path: 'icons/kenz_off.png' })
    setDismiss(false);
  }
}

function getStreamerStatus() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl, true);
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

// on notification close
browser.notifications.onClosed.addListener(function () {
  setDismiss(true);
});


// on notification click
browser.notifications.onClicked.addListener(function () {
  browser.tabs.create({ url: streamInfo.channel.url });
  browser.notifications.clear("streamerLive");
  setDismiss(true);
});

// creates the retrieve timer
browser.alarms.create("retrieveStatus", {
  delayInMinutes: 1,
  periodInMinutes: 1
});

// on install
browser.runtime.onInstalled.addListener(function () {
  getDismiss(function (item) {
    if (item.dismiss === null || item.dismiss === undefined)
      setDismiss(false);
    browser.browserAction.setIcon({ path: 'icons/kenz_off.png' });
  })
})



// local storage
function getDismiss(callback) {
  browser.storage.local.get(['dismiss'], callback);
}

function setDismiss(value) {
  browser.storage.local.set({ dismiss: value });
}
