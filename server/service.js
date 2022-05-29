const { Element, isValidElementType, isValidSolarElementType } = require('./element.js');
const error = require('./error.js');

// In Wh/m^2
// Average values for summer months
const AVERAGE_SOLAR_ENERGY = 800;
const SOLAR_PANEL_ENERGY = 200;

module.exports = function (db) {

  const usersDb = db.user();
  const boardsDb = db.board();

  return {
    getBoard: getBoard,
    getBoardElements: getBoardElements,
    getBoardElement: getBoardElement,
    postBoardElement: postBoardElement,
    updateBoardElement: updateBoardElement
  }

  function getBoard(username) {
    return usersDb.getBoardId(username)
      .then(boardId => boardsDb.get(boardId));
  }

  function getBoardElements(username) {
    return usersDb.getBoardId(username)
      .then(boardId => boardsDb.getElements(boardId));
  }

  function getBoardElement(username, elementId) {
    return usersDb.getBoardId(username)
      .then(boardId => boardsDb.getElements(boardId))
      .then(elements => {
        const element = elements.find(element => element.id == elementId);
        return element != undefined ?
          Promise.resolve(element) :
          Promise.reject(error(404, `Element with id: ${elementId} does not exist`));
      });
  }

  function postBoardElement(username, elementBody) {
    const element = createElement(elementBody);
    if (element == null)
      return Promise.reject(error(400, "Invalid element body"));

    return usersDb.getBoardId(username)
      .then(boardId => boardHasSun(boardId, element))
      .then(boardId =>
        boardsDb.addElement(boardId, element)
          .then(elementId =>
            checkIfNeedsToUpdateBoard(boardId, element)
              .then(() => elementId)));
  }

  function updateBoardElement(username, elementId, newElementBody) {
    return usersDb.getBoardId(username)
      .then(boardId =>
        boardsDb.getElement(boardId, elementId)
          .then(elementToUpdate => {
            if (newElementBody.position)
              elementToUpdate.position = getElementValidPosition(newElementBody.position) ?? elementToUpdate.position;

            if (newElementBody.type != "Sun" && newElementBody.solarPanels) {
              elementToUpdate.solarPanels = newElementBody.solarPanels;
              return boardsDb.getElements(boardId)
                .then(boardElements => {
                  const sun = boardElements.find(boardElement => boardElement.data.type == "Sun");
                  return sun == undefined ?
                    Promise.resolve(elementToUpdate) :
                    Promise.resolve(getAndUpdateElementSolarValues(sun.data, elementToUpdate));
                });
            }

            return elementToUpdate;
          })
          .then(newElement =>
            boardsDb.updateElement(boardId, elementId, newElement)
              .then(() => checkIfNeedsToUpdateBoard(boardId, newElement))
              .then(() => newElement))
      );
  }

  function boardHasSun(boardId, element) {
    if (element.type == "Sun") {
      return boardsDb.getElements(boardId)
        .then(boardElements => {
          const sun = boardElements.find(boardElement => boardElement.data.type == "Sun");
          return sun == undefined ?
            Promise.resolve(boardId) :
            Promise.reject(error(400, `Board already has an element of type Sun`));
        })
    }

    return Promise.resolve(boardId);
  }

  // If the added/updated element is a Sun element,
  // then update the element's sun dependent values.
  function checkIfNeedsToUpdateBoard(boardId, element) {
    if (element.type != "Sun")
      return Promise.resolve();
    return updateBoard(boardId, element);
  }

  function createElement(element) {
    let { pos, type } = getElementValidPositionAndType(element);
    // TODO: Improve error handling.
    if (pos == null || type == null) return null;
    if (element.type != "Sun" && element.solarPanels == undefined) return null;
    return type == "Sun" ? new Element(type, pos) : new Element(type, pos, element.solarPanels);
  }

  function getElementValidPositionAndType(element) {
    return {
      pos: getElementValidPosition(element.position),
      type: getElementValidType(element.type)
    }
  }

  function getElementValidPosition(position) {
    if (position == undefined) return null;
    let pos = position.replace(/\s/g, '').split(",", 2).map(Number);
    if (pos.length != 2) return null;
    if (pos[0] < 0 || pos[0] >= 10 /*columns*/) return null;
    if (pos[1] < 0 || pos[1] >= 10 /*lines*/) return null;
    return { x: pos[0], y: pos[1] };
  }

  function getElementValidType(type) {
    return isValidElementType(type) ? type : null;
  }

  function updateBoard(boardId, sunElement) {
    return boardsDb.getElements(boardId)
      .then(elements => {
        elements
          .filter(element => isValidSolarElementType(element.data.type))
          .map(element => {
            element.data = getAndUpdateElementSolarValues(sunElement, element.data);
            return element;
          })
          .map(element => boardsDb.updateElement(boardId, element.id, element.data));

        return Promise.all(elements);
      });
  }

  // Updates the element's Solar Irradiance and Solar Panel Output based on Sun relative position.
  function getAndUpdateElementSolarValues(sun, solarElement) {
    let solarIrradiance = calculateIrradiance();
    let solarPanelOutput = calculateSolarOutput();

    solarElement.irradiance = solarIrradiance;
    solarElement.powerOutput = solarPanelOutput;

    return solarElement;

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
