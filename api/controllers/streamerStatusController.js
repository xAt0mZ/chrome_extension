'use strict';
var background = require('../background'),
  config = require('../config');

const twitchBaseURL = 'https://www.twitch.tv/';

exports.getStatus = function (req, res) {
  var status = background.streamers[config.streamer];
  if (status !== null && status !== undefined)
    res.json(status);
  else
    res.json({});
};

