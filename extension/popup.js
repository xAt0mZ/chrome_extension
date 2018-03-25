'use strict';

function resetNotifications(event) {
  chrome.storage.local.set({dismiss: false});
  window.close();
}

document.getElementById('refreshNotifications').addEventListener('click', resetNotifications);
