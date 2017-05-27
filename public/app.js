'use strict';

// configuration
var HOST = '192.168.1.1';
var PORT = 8080;
var CELL_SIZE = 150;
var NUM_ROWS = 4;
var NUM_COLS = 5;

function MateLight() {
  this.container = document.getElementById('container');
  this.init();
  this.bindListener();
}

MateLight.prototype.init = function() {
  this.container.style.width = CELL_SIZE * NUM_COLS +'px';
  this.container.style.height = CELL_SIZE * NUM_ROWS +'px';

  for (var y=0; y<NUM_ROWS; y++) {
    for (var x=0; x<NUM_COLS; x++) {
      var div = document.createElement('DIV');

      div.className = 'cell';
      div.setAttribute('y', y);
      div.setAttribute('x', x);
      div.style.height = CELL_SIZE+'px';
      div.style.width = CELL_SIZE+'px';

      this.container.appendChild(div);
    }
  }
};

MateLight.prototype.bindListener = function() {
  this.container.onclick = function(event) {
    var target = event.target;

    if (!target.classList.contains('cell')) {
      return;
    }

    var x = parseInt(target.getAttribute('x'));
    var y = parseInt(target.getAttribute('y'));

    if (target.classList.contains('on')) {
      this.off(target);
      ws.send(JSON.stringify({ x: x, y: y, s: 0 }));
    }
    else {
      this.on(target);
      ws.send(JSON.stringify({ x: x, y: y, s: 1 }));
    }
  }.bind(this);
};

MateLight.prototype.getCell = function(x, y) {
  var selector = '[x="'+ x+'"][y="'+ y +'"]';
  return document.querySelector(selector);
}

MateLight.prototype.on = function(target) {
  target.classList.add('on');
};

MateLight.prototype.off = function(target) {
  target.classList.remove('on');
};

MateLight.prototype.set = function(matrix) {
  for (var y=0; y<NUM_ROWS; y++) {
    for (var x=0; x<NUM_COLS; x++) {
      var cell = this.getCell(x, y);

      matrix[y][x] ? this.on(cell) : this.off(cell);
    }
  }
}

var mateLight = new MateLight();

var ws = new WebSocket('ws://'+HOST+':'+PORT, "protocolOne");

ws.onopen = function() {
  document.querySelector('#mumlr').classList.add('ok');
};

ws.onclose = function() {
  document.querySelector('#mumlr').classList.remove('ok');
};

ws.onmessage = function(message) {
  var led = JSON.parse(message.data);

  if (led.matrix) {
    mateLight.set(led.matrix);
    return;
  }

  var cell = mateLight.getCell(led.x, led.y);

  led.s === 1 ? mateLight.on(cell) : mateLight.off(cell);
};

// use FastClick to remove click delays
// on browsers with touch UIs
var attachFastClick = Origami.fastclick;
attachFastClick(document.body);
