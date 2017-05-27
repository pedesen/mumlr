'use strict';

const connect = require('connect');
const serveStatic = require('serve-static');
const WebSocket = require('ws');

// configuration
const WS_PORT = 8080;
const APP_PORT = 3000;
const NUM_ROWS = 4;
const NUM_COLS = 5;

function MateLight() {
  this.createMatrix();
}

MateLight.prototype.createMatrix = function() {
  this.matrix = [];

  for (var y=0; y<NUM_ROWS; y++) {
    this.matrix[y] = [];

    for (var x=0; x<NUM_COLS; x++) {
      this.matrix[y][x] = 0;
    }
  }
}

MateLight.prototype.change = function(x, y, status) {
  this.matrix[y][x] = status;
}

const mateLight = new MateLight();

const wss = new WebSocket.Server({ port: WS_PORT }, function() {
  console.log('websocket listening on port '+ WS_PORT);
});

var app = connect();

app.use(serveStatic('public'));
app.listen(APP_PORT);

console.log('serving static files on port ' + APP_PORT);

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

