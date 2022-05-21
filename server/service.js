const board = require('./board.js')(10, 10);
const { Sun } = require('./element.js');

function app() {
  board.init();
}

app();
