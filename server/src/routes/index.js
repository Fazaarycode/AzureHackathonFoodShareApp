const router = require('express').Router();
const Logger = require('../utils/Logger');
// const axios = require('axios');
const foodMapAPI = require('../utils/mapAPI');
const collectorAPI = require('../models/collector');
const hubAPI = require('../models/hub');
const db = require('../sequelize').db;
const sendToEventHub = require('../eventHubs/send');
const lookForJobs = require('../eventHubs/receive.js');

// db.setupORM();

router.post('/producerLogin', async (req, res, next) => {
  console.log('Req body for producerLogin received ', req.body);
  // Query producer and return to user
  db.checkConnection();
  let producerModel = await db.getProducerModel();
  console.log('PMM ', producerModel)
  let loggedInProducerData = await db._getProducerLoginInfo(req.body, producerModel);
  if (loggedInProducerData.loggedInProducer) {
    res.send({ success: true, loggedInProducerData });
  }
  else {
    res.send({ success: false, loggedInProducerData });
  }
})

router.post('/collectorLogin', async (req, res, next) => {
  // console.log('Req body for collectorLogin received ', req.body);
  // Query producer and return to user
  db.checkConnection();
  let collectorModel = await db.getCollectorModel();
  let loggedInCollectorData = await db._getCollectorLoginInfo(req.body, collectorModel);
  if (loggedInCollectorData.loggedInCollector) {
    res.send({ success: true, loggedInCollectorData });
  }
  else {
    res.send({ success: false, loggedInCollectorData });
  }
})

router.post('/consumerHubLogin', async (req, res, next) => {
  console.log('Req body for consumerHubLogin received ', req.body);
  // Query producer and return to user
  db.checkConnection();
  let consumerHubModel = await db.getConsumerHubModel();
  let loggedInConsumerHubData = await db._getConsumerHubLoginInfo(req.body, consumerHubModel);
  if (loggedInConsumerHubData.loggedInConsumerHub) {
    res.send({ success: true, loggedInConsumerHubData });
  }
  else {
    res.send({ success: false, loggedInConsumerHubData });
  }
})

router.post('/verifyOTP', async (req, res, next) => {
  db.checkConnection(); // Could have been a middleware :( 
  let consumerHubModel = await db.getConsumerHubModel();
  let otpConfirmationStatus = await db._verifyOTP(req.body, consumerHubModel)
  if (otpConfirmationStatus === 'success') res.send('success');
  if (otpConfirmationStatus === 'failure') res.send('failure');

})
// Look for open jobs for Collector
router.get('/lookForJobs', async (req, res, next) => {
  console.log('requested for jobs')
  await lookForJobs().catch(err => console.log(`Error receiving jobs ${err}`))
})

router.get('/closestCollectorToProducer', async (req, res, next) => {
  console.log('Req body for closestCollectorToProducer received ', req.query);
  // let producerId = req.query.producerId;
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  // Call API
  let collectorInfo = await collectorAPI.findClosestCollector({ latitude, longitude })
  // console.log('Nearest collector is ' , collectorInfo)
  await sendToEventHub(collectorInfo).catch(err => {
    console.log(`Err sending Data to Event Hub  ${err}`)
  });
  res.send({ collectorInfo })
})

router.post('/addBatchServingData', async (req, res, next) => {
  console.log('Received Req Body for Batch servings', req.body)
  db.checkConnection();
  let response = await db.mutationAddFoodBatch(req.body);
  res.send({ success: true, response })
})

router.post('/addEachServings', async (req, res, next) => {
  console.log("RECEIVED REQ: /addEachServings ", req.body)
  const data = req.body;

  // Update or Create , delete
  //SetupSequelize
  db.checkConnection();
  let producerModel = await db.getProducerModel();
  let eachFoodServingModel = await db.getEachFoodServingModel();

  Logger.info(`💖 ${JSON.stringify(producerModel, null, 2)}`);


  // Call the mutation to Update Data in DB -> Table: eachFoodServingModel
  let results = await db.mutationAddEachServings(data);
  // db.createDummyTable();
  // Logger.info(`🚹🚹🚹 createDummyTable executed`);
  // Models
  res.send({ success: true, results });
});

router.get('/getAllHubs', async (req, res, next) => {
  // Get All Hubs
  // console.log('Q P ', req.query)
  let consumerHubModel = await db.getConsumerHubModel();
  const { allHubs, allDestinationHubsCoords } = await db.queryAllConsumerHubs();

  // Return fastest hubs (Desc to ASC) to the collector
  const fastestHubs = await foodMapAPI.getSrcToManyFastestRoutes(
    { latitude: req.query.latitude, longitude: req.query.longitude },
    allDestinationHubsCoords
  )
  res.send({ success: true, fastestHubs })
})


router.get('/getRouteFromProducerToCollector', async (req, res, next) => {
  console.log('Received Request for P -> C', req.query)
  // Producer
  let srcPos = { id: '1', latitude: req.query.producerLatitude, longitude: req.query.producerLongitude }
  let destPos = { latitude: req.query.collectorLatitude, id: '2', longitude: req.query.collectorLongitude }
  // const pToC = await foodMapAPI.getSingleRoute(srcPos, destPos);
  let availableRoute = await foodMapAPI.getSingleRoute(
    { latitude: req.query.producerLatitude, longitude: req.query.producerLongitude, id: 1 },
    destPos
  );

  res.send({ success: true, availableRoute }) // Change...
})


/*****************************************************************************
 * TESTING API(s)
 * 
 */

router.get('/eventtest', async (req, res, next) => {
  Logger.info(`📝📝📝 eventtest START`);

  //'-33.72495396478162','151.05162632278288'
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  let collectorInfo = await collectorAPI.findClosestCollector({ id: "test123", latitude, longitude })
  Logger.info(`🧮🧮🧮 eventtest collectorInfo: ${JSON.stringify(collectorInfo, null, 2)}`);

  await sendToEventHub(collectorInfo).catch(err => {
    console.log(`Err sending Data to Event Hub  ${err}`)
  });

  Logger.info(`📝📝📝 eventtest END`);
  res.send("ok");
});

router.get('/hubtest', async (req, res, next) => {
  // find the closest collector given that collector has picked up the batch and ready to send from producer to hub
  const result = await hubAPI.findClosestHub({ id: "pos2", latitude: '-33.86023580352346', longitude: '151.20539013407318' });
  Logger.info(`🚹🚹🚹 hubtest executed: ${result.srcPos}`);
  return res.send(result);
});

router.get('/collectortest', async (req, res, next) => {
  const result = await collectorAPI.findClosestCollector({ id: "pos2", latitude: '-33.86023580352346', longitude: '151.20539013407318' });
  Logger.info(`🚹🚹🚹 collectortest executed: ${result.length}`);
  return res.send(result);
});

router.get('/maptest', async (req, res, next) => {

  const result = await foodMapAPI.getSrcToManyFastestRoutes({ id: "pos1", latitude: "52.50931", longitude: "13.42936" },
    [{ id: "pos2", latitude: "52.50274", longitude: "13.43872" },
    { id: "pos3", latitude: "52.48390056516629", longitude: "13.435099912517751" }]
  );

  Logger.info(`🚹🚹🚹 maptest executed: ${result.length}`);
  return res.send(result);
});



module.exports = router;