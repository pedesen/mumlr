'use strict';

const connect = require('connect');
const serveStatic = require('serve-static');
const WebSocket = require('ws');

// configuration
const WS_PORT = 8080;

const wss = new WebSocket.Server({ port: WS_PORT }, function() {
  console.log('websocket listening on port '+ WS_PORT);
});

var app = connect();

app.use(serveStatic('public'));
app.listen(3000);

console.log('serving static files on port 3000');

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.broadcast(message);
  });
});