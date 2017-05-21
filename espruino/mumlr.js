var Matrix16x8 = require('matrix').Matrix16x8;
var wifi = require('Wifi');
var WebSocket = require('ws');

// configuration
var HOST = '192.168.1.1';
var PORT = '8080';
var WIFI_SSID = 'MY_SSID';
var WIFI_PASS = 'MY_PASS';

var matrix = new Matrix16x8({scl:4, sda:5, address:0x70, brightness:15});

function draw(x, y, state) {
  matrix.drawPixel(x+10, y+4, state);
}

function connectWebSocket() {
  var ws = new WebSocket(HOST, {
    path: '/',
    port: PORT
  });

  ws.on('open', function() {
    console.log('[WS] connected to '+HOST);
  });

  ws.on('message', function(msg) {
    var led = JSON.parse(msg);
    console.log(led);
    draw(parseInt(led.x), parseInt(led.y), parseInt(led.s));
    matrix.render();
  });
}

E.on('init', function() {
  wifi.connect(WIFI_SSID, {password: WIFI_PASS}, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('[WiFi] connected! IP: '+ wifi.getIP().ip);
      connectWebSocket();
    }
  });
});

save();
