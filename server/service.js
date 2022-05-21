const board = require('./board.js')(10, 10);
const { Sun } = require('./element.js');

function app() {
  const sun = new Sun(5, 5);
  board.init();

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let solarElement = board.get(i, j);
      if (solarElement == null) continue;

      calculateAndUpdateIrradiance(solarElement);
    }
  }

  function calculateAndUpdateIrradiance(solarElement) {
    
  }
}

app();
