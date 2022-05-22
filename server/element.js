const VALID_TYPES = ["House", "Van"];

function House(position, solarPanels) {
  this.type = "House";
  this.position = {x: position.x, y: position.y};
  this.solarPanels = solarPanels;
  this.irradiance = 0;
}

function Van(position, solarPanels) {
  this.type = "Van";
  this.position = {x: position.x, y: position.y};
  this.solarPanels = solarPanels;
  this.irradiance = 0;
}

exports.SolarElement = function(type, position, solarPanels) {
  let element = null;
  switch(type) {
    case "House":
      element = new House(position, solarPanels);
      break;
    case "Van":
      element = new Van(position, solarPanels);
      break;
  }
  return element;
}

exports.House = House;

exports.Van = Van;

exports.Sun = function(x, y) {
  this.position = {x: x, y: y};
}

exports.isValidElementType = function(type) {
  if (type == undefined) return false;
  if (!VALID_TYPES.includes(type)) return false;
  return true;
}