'use strict';

const apiUrl = "http://localhost:3000/status/";
const streamer = 'armatvhs';
const streamerUrl = 'https://www.twitch.tv/kennystream';

var dismiss = false;

function notifyClient(res) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/ext_icon48.png',
    title: 'KennyStream EST LIVE !',
    message: "Je viens de lancer mon live, rejoins moi en cliquant ici !",
    buttons: [
      { title: 'Regarder !' }
    ],
    eventTime: 60000
  });
}

function actionsOnStreamerLive(res) {
  if (Object.keys(res).length !== 0) {
    chrome.browserAction.setIcon({ path: 'icons/kenz_on.jpeg' })
    if (dismiss == false)
      notifyClient(res);
  } else {
    chrome.browserAction.setIcon({ path: 'icons/kenz_off.jpeg' })
    dismiss = false;
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


// action on notification button click
chrome.notifications.onButtonClicked.addListener(function () {

  chrome.tabs.create({ url: streamerUrl });

  dismiss = true;
});

chrome.notifications.onClosed.addListener(function () {
  dismiss = true;
});

chrome.notifications.onButtonClicked.addListener(function () {
  chrome.tabs.create({ url: streamerUrl });
  dismiss = true;
});

// creates the retrieve timer
chrome.alarms.create("retrieveStatus", {
  delayInMinutes: 1,
  periodInMinutes: 1
});




