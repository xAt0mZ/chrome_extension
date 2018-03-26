var express = require('express'),
    app = express(),
    config = require('./config'),
    port = process.env.PORT || config.port,
    bodyParser = require('body-parser'),
    background = require('./background'),
    path = require('path');


function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
}

function notFoundResponse(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/public'));

var routes = require('./routes/streamerStatusRoutes');
routes(app);

app.get('/extensions', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/extensions.html'));
});


// 4 lines to be always last chunk of file
app.use(notFoundResponse);
app.listen(port);
background.getStreamer(config.streamer);
console.log('streamerStatus API started on : ' + port);

