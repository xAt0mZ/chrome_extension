const axios = require("axios");

const intervalTime = 1000 * 10;
const clientId = "q6k0pb26rb18wg5jna43tcgg6vg4n9";

var streamers = {};
exports.streamers = streamers;

exports.getStreamer = function (streamer) {
    const url = "https://api.twitch.tv/kraken/streams/" + streamer + "?client_id=" + clientId;

    setInterval(function () {
        axios
            .get(url)
            .then(response => {
                streamers[streamer] = response.data.stream;
            })
            .catch(error => {
                console.log(error);
            });
    }, intervalTime)
};