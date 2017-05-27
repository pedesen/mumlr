'use strict';

const connect = require('connect');
const serveStatic = require('serve-static');
const WebSocket = require('ws');
const config = require('./config');

function MateLight() {
  this.createMatrix();
}

MateLight.prototype.createMatrix = function() {
  this.matrix = [];

  for (var y = 0; y < config.matrix_rows; y++) {
    this.matrix[y] = [];

    for (var x = 0; x < config.matrix_cols; x++) {
      this.matrix[y][x] = 0;
    }
  }
}

MateLight.prototype.change = function(x, y, status) {
  this.matrix[y][x] = status;
}

const mateLight = new MateLight();

const wss = new WebSocket.Server({ port: config.websocket_port }, function() {
  console.log('websocket listening on port '+ config.websocket_port);
});

var app = connect();

app.use(serveStatic('app'));
app.listen(config.host_port);

console.log('serving static files on port ' + config.host_port);

wss.broadcast = function(data) {
  wss.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function(ws) {
  console.log('clients: ' + wss.clients.size);

  // send current matrix to connecting client
  ws.send(JSON.stringify({ matrix: mateLight.matrix }));

  ws.on('message', function(message) {
    const led = JSON.parse(message);

    // change mateLight state
    mateLight.change(led.x, led.y, led.s);

    // broadcast change to all clients
    wss.broadcast(message);
  });

  ws.on('close', function(ws) {
    console.log('clients: ' + wss.clients.size);
  });
});

