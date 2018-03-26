'use strict';

function resetNotifications(event) {
  chrome.storage.local.set({ dismiss: false });
  window.close();
}

chrome.storage.local.get(['dismiss'], function (item) {
  if (item.dismiss)
    document.getElementById('notificationsStatus').innerHTML = 'Disabled';
  else
    document.getElementById('notificationsStatus').innerHTML = 'Enabled';
});

document.getElementById('refreshNotifications').addEventListener('click', resetNotifications);
