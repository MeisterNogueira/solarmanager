module.exports = function (collection) {

  return {
    create: create,
    get: get,
    getBoardId: getBoardId
  }

  function create(username, password) {
    return get(username)
      .then(user => user.exists ?
        Promise.reject(Error("User already exists")) :
        collection.doc(username).set({
          username: username,
          password: password
        })
      );
  }

  function get(username) {
    return collection.doc(username).get()
  }

  function getBoardId(username) {
    return get(username)
      .then(doc => doc.exists ?
        Promise.resolve(doc.data().boardId) :
        Promise.reject("User does not exist")
      )
  }
}