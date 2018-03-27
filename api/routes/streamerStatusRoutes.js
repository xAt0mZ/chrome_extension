'use strict';
module.exports = function (app) {
  var status = require('../controllers/streamerStatusController');

  app.route('/status')
    .get(status.getStatus)
};
