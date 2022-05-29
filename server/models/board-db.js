const error = require('./../error.js');

module.exports = function (db, collection) {

  return {
    get: get,
    getElements: getElements,
    getElement: getElement,
    addElement: addElement,
    updateElement: updateElement
  }

  function get(boardId) {
    return collection.doc(boardId).get()
      .then(doc => doc.exists ?
        Promise.resolve(doc.data()) :
        Promise.reject(error(404, `Board with id ${boardId} does not exist`)));
  }

  function getElements(boardId) {
    return collection.doc(boardId).collection("elements").listDocuments()
          .catch(() => Promise.reject(error(404, `Board with id ${boardId} does not exist`)))
          .then(docs => db.getAll(...docs))
          .then(elements => 
            elements
              .filter(element => element.exists)
              .map(element => { 
                return {
                  id: element.id, 
                  data: element.data()
                }
              })
          )
          .catch(() => Promise.reject(error(400, `Error with elements of board: ${boardId}`)));
  }

  function getElement(boardId, elementId) {
    return collection.doc(boardId).collection("elements").doc(elementId).get()
      .then(doc => doc.exists ?
        Promise.resolve(doc.data()) :
        Promise.reject(error(404, `Element with id ${elementId} does not exist`)));
  }

  function addElement(boardId, element) {
    return collection.doc(boardId).collection("elements")
      .add({...element})
      .catch(() => Promise.reject(error(400, "Error adding element")))
      .then(doc => doc.id);
  }

  function updateElement(boardId, elementId, newElement) {
    return collection.doc(boardId).collection("elements").doc(elementId).update(newElement)
      .then(() => newElement);
  }
}