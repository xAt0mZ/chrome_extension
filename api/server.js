var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    background = require('./background');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routes/streamerStatusRoutes');
routes(app);

app.listen(port);
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

const streamer = 'armatvhs';
background.getStreamer(streamer);

console.log('streamerStatus API started on : ' + port);
