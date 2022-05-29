const VALID_TYPES = ["House", "Van", "Sun"];
const VALID_SOLAR_TYPES = ["House", "Van"];

exports.Element = function(type, position, solarPanels) {
  let element = null;
  switch(type) {
    case "House":
      element = new House(position, solarPanels);
      break;
    case "Van":
      element = new Van(position, solarPanels);
      break;
    case "Sun":
      element = new Sun(position)
      break;
  }
  return element;
}

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

function Sun(position) {
  this.type = "Sun";
  this.position = {x: position.x, y: position.y};
}

exports.House = House;
exports.Van = Van;
exports.Sun = Van;

exports.isValidElementType = function(type) {
  if (type == undefined) return false;
  if (!VALID_TYPES.includes(type)) return false;
  return true;
}

exports.isValidSolarElementType = function(type) {
  if (type == undefined) return false;
  if (!VALID_SOLAR_TYPES.includes(type)) return false;
  return true;
}