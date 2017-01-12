#!/bin/env node

var express = require('express');
var proxy = require('express-http-proxy');
var cli = require('commander');
var url = require('url');

cli
    .version('1.0.0')
    .option('-s, --server [ip]', 'Server to proxy API calls to [required]')
    .option('-d, --directory [directory]', 'Static file directory [default ./]')
    .option('-p, --port [port]', 'Port to listen on [default 8080]')
.parse(process.argv);

var app = express();
if (!cli.server) {
    cli.outputHelp();
    process.exit(0);
}

var port = cli.port || 8080;
var directory = cli.directory || './';
var server = cli.server;

app.use(express.static(directory));

app.use('/api', proxy(server, {
    forwardPath: function(req/*, res*/) {
        return '/api'+url.parse(req.url).path;
    }
}));

app.listen(port, function () {
    console.log('Listening on port '+port);
});
