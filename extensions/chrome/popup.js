'use strict';

function switchAllowNotifications(event) {
  chrome.storage.local.get(['allowNotifications'], function (item) {
    chrome.storage.local.set({ allowNotifications: !item.allowNotifications });
    window.close();
  });
}

chrome.storage.local.get(['allowNotifications'], function (item) {
  var button = document.getElementById('refreshNotifications');
  if (item.allowNotifications) {
    button.style.backgroundColor = '#ff4d4d';
    button.textContent = 'Disable notifications';
  }
  else {
    button.style.backgroundColor = '#2ecc71';
    button.textContent = 'Enable notifications';
  }
});

document.getElementById('refreshNotifications').addEventListener('click', switchAllowNotifications);
