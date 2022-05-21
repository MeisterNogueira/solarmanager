const VALID_TYPES = ["House", "Van"];

function House(position, solarPanels) {
  this.type = "House";
  this.position = {x: position.x, y: position.y};
  this.solarPanels = solarPanels;
}

function Van(position, solarPanels) {
  this.type = "Van";
  this.position = {x: position.x, y: position.y};
  this.solarPanels = solarPanels;
}

exports.SolarElement = function(e) {
  let element = null;
  switch(e.type) {
    case "House":
      element = new House(e.position, e.solarPanels);
      break;
    case "Van":
      element = new Van(e.position, e.solarPanels);
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