const router = require('express').Router()

// /solarmanager
module.exports = function(service) {
  
  router.get('/board', getBoard);
  router.get('/board/elements', getBoardElements);
  router.post('/board/elements', postBoardElement);
  router.get('/board/elements/:id', getBoardElement);
  router.put('/board/elements/:id', putBoardElement);

  Promise.prototype.sendResponse = sendResponse;

  return router;

  // TODO: Check if user is authenticated. Get username.

  // GET /board
  function getBoard(req, res) {
    let username = "admin";
    service.getBoard(username).sendResponse(res);
  }

  // GET /board/elements
  function getBoardElements(req, res) {
    let username = "admin";
    service.getBoardElements(username).sendResponse(res);
  }

  // POST /board/elements
  function postBoardElement(req, res) {
    let username = "admin";
    service.postBoardElement(username, req.body).sendResponse(res, 201);
  }

  // GET /board/elements/:id
  function getBoardElement(req, res) {
    let username = "admin";
    service.getBoardElement(username, req.params.id).sendResponse(res);
  }

  // PUT /board/elements/:id
  function putBoardElement(req, res) {
    let username = "admin";
    service.updateBoardElement(username, req.params.id, req.body).sendResponse(res);
  }

  function sendResponse(res, successStatusCode = 200, errStatusCode = 500) {
    this.then(processSuccess(res, successStatusCode)).catch(processError(res, errStatusCode));

    function processSuccess(res, statusCode) {
      return processResponse(res, data => data.statusCode ? data.statusCode : statusCode);
    }

    function processError(res, statusCode) {
      return processResponse(res, error => error ? error.statusCode : statusCode);
    }

    function processResponse(res, statusCode) {
      return function(data) {
        res.statusCode = statusCode(data)
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(data, 0, 4))
      }
    }
  }

}