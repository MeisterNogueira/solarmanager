const db = require('./firestore-db.js')();

module.exports = function (db) {
  return function (req, res, next) {

    if (!req.headers.authorization)
      return res.status(401).json({ error: 'Missing credentials' });

    const encondedCredentials = req.headers.authorization.split(' ');
    const username = Buffer.from(encondedCredentials[1], 'base64').toString().split(':')[0];
    db.user().get(username)
      .then(doc => {
        if (!doc.exists) {
          res.status(401).json({ error: 'Wrong Credentials'});
          res.end();
          return;
        }
        
        if (doc.data().credentials != encondedCredentials[1]) {
          res.status(401).json({ error: 'Wrong Credentials 1'});
          res.end();
          return;
        }

        req.username = username;
        next();
      })
  }
}