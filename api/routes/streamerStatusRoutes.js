'use strict';
module.exports = function (app) {
  var status = require('../controllers/streamerStatusController');

  app.route('/status/:channelName')
    .get(status.getStatusByName)
};
