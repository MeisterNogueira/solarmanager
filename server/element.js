exports.SolarElement = function(e) {
  let element = null;
  switch(e.type) {
    case "House":
      element = new House(e.position.x, e.position.y);
      break;
    case "Van":
      element = new Van(e.position.x, e.position.y);
      break;
    default:
      element = new EmptyElement();
  }
  return element;
}

function House(x, y) {
  this.type = "House";
  this.position = {x: x, y: y}
}

function Van(x, y) {
  this.type = "Van";
  this.position = {x: x, y: y}
}

exports.House = House;

exports.Van = Van;

exports.EmptyElement = function() {
  this.type = "Empty";
}

exports.Sun = function(x, y) {
  this.position = {x: x, y: y};
}