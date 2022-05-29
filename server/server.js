const express = require('express');
const bodyParser = require('body-parser');

const db = require('./firestore-db.js')();
const service = require('./service.js')(db);
const authRouter = require('./solarmanager-auth.js')(db);
const router = require('./solarmanager-api.js')(service);

const app = express();

app.use(bodyParser.json());
app.use('/solarmanager', authRouter);
app.use('/solarmanager', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
