#!/bin/env node

var express = require('express');
var proxy = require('express-http-proxy');
var cli = require('commander');
var url = require('url');

cli
    .version('1.0.0')
    .option('-n, --nms [ip]', 'NMS to proxy API calls to [required]')
    .option('-p, --port [port]', 'Port to listen on [default 8080]')
.parse(process.argv);

var app = express();
if (!cli.nms) {
    cli.outputHelp();
    process.exit(0);
}

var port = cli.port || 8080;
var nms = cli.nms;

app.use(express.static('./'));

app.use('/api', proxy(nms, {
    forwardPath: function(req/*, res*/) {
        return '/api'+url.parse(req.url).path;
    }
}));

app.listen(port, function () {
    console.log('Listening on port '+port);
});
