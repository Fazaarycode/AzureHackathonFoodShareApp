process.env.LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'info';

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const Logger = require('./utils/Logger');
var ip = require('ip')

// after third party initialisation, first to execute and store credentials in memory
const secretManager = require('./key').manager;
const db = require('./sequelize').db;
const routes = require('./routes/index');

(async () => {
  const port = process.env.PORT || 6001;

  Logger.info('Hello Runtimeterror server');
  Logger.info(`Configured Port ${port}\n`);
  Logger.info('IP ADDRESS: ' , ip.address())

  // initialise secret manager
  await secretManager.initialise();  
  const mapKey = secretManager.getMapKey();
  const dbPass = secretManager.getDbPass();
  Logger.info(`Map Key 🔑: ${secretManager.isInitialised()} -> ${mapKey.value}`);
  Logger.info(`DB Pass 🔑: ${secretManager.isInitialised()} -> ${dbPass.value}`);
    
  // initialise database
  await db.initialise(dbPass.value);
  db.checkConnection();
  

  const app = express();
  app.use(bodyParser.json());
  app.use(cors()) // Use this after the variable declaration

  
  // Routes
  app.use(routes);

  // Handle Errors
  app.use((err, req, res, next) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      return res.sendStatus(500);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
  });

  app.use('/version', async (req, res) => {
    const ts = new Date();
    const str = `Deployed Runtimeterror: 1.0.2 🔷🔷🔷: ${ts.toISOString()}`;
    return res.send(str);
  });

  app.listen(port, () => {
    Logger.info(`Express for metrics & status listening on port ${port}`);
  });
})();
