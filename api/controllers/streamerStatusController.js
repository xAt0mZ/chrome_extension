'use strict';
var background = require('../background');

exports.getStatusByName = function (req, res) {
  var streamer = req.params.channelName;
  var status = background.streamers[streamer];
  if (status !== null && status !== undefined)
    res.json(status);
  else
    res.json({});
};

