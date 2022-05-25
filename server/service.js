const board = require('./board.js')(10, 10);
const db = require('./firestore-db.js')();
const { Sun } = require('./element.js');

// In Wh/m^2
// Average values for summer months
const AVERAGE_SOLAR_ENERGY = 800;
const SOLAR_PANEL_ENERGY = 200;

function app() {
  const sun = new Sun(0, 9);
  const user = { username: "admin" };
  board.init();
  db.createBoard(user.username, {
    lines: board.lines,
    columns: board.columns,
    board: [
      {
        "type": "House",
        "position": "1,1",
        "solarPanels": 1
      },
      {
        "type": "House",
        "position": "4,2",
        "solarPanels": 3
      },
      {
        "type": "House",
        "position": "7,4",
        "solarPanels": 2
      },
      {
        "type": "House",
        "position": "9,3",
        "solarPanels": 1
      },
      {
        "type": "Van",
        "position": "1,5",
        "solarPanels": 1
      },
      {
        "type": "Van",
        "position": "8,9",
        "solarPanels": 1
      }
    ],
  });

  db.getUserBoard(user.username);
  //updateElement(board.get(9, 3));

  function updateElement(solarElement) {
    let solarIrradiance = calculateIrradiance();
    let solarPanelOutput = calculateSolarOutput();

    function calculateIrradiance() {
      let sunDistance = getSunDistanceToElement(sun, solarElement);
      let lostIrradiance = AVERAGE_SOLAR_ENERGY * ((sunDistance * 0.5) / 14);
      let irradiance = AVERAGE_SOLAR_ENERGY - lostIrradiance;
      return Math.round(irradiance);
    }

    function calculateSolarOutput() {
      return Math.round((SOLAR_PANEL_ENERGY * solarElement.solarPanels) * (solarIrradiance / 1000));
    }

    function getSunDistanceToElement(sun, solarElement) {
      if (sun.position.x == solarElement.position.x)
        return Math.abs(sun.position.y - solarElement.position.y);
      if (sun.position.y == solarElement.position.y)
        return Math.abs(sun.position.x - solarElement.position.x)
      return hypotenuseValue();

      function hypotenuseValue() {
        let c1 = Math.pow(Math.abs(sun.position.x - solarElement.position.x), 2);
        let c2 = Math.pow(Math.abs(sun.position.y - solarElement.position.y), 2);
        return (Math.round(Math.sqrt(c1 + c2) * 100) / 100).toFixed(2);
      }
    }
  }
}

app();
