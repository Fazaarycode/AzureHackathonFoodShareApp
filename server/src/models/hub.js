const Logger = require('../utils/Logger');
const db = require('../sequelize').db;
const foodMapAPI = require('../utils/mapAPI');

// find all collectors
const _findAllHub = async () => {  
  return await db.queryAllConsumerHubs();  
}

// srcPos ={latitude, longitude} Collector
// go thur the entire record of hub and find the quickest available 
const _findClosestHub = async (srcPos) => {

  const {allHubs: hubs} = await db.queryAllConsumerHubs();
  let updatedHubs = hubs.map(h => {
    // make sure property lat and long exist, change to same variable names throughout
    let copyHub = {...h};
    // copyHub['lat'] = h.latitude;
    // copyHub['long'] = h.longitude;
    return copyHub;
  });
  // Logger.info(`💚💚 _findCollector res: ${JSON.stringify(collectors, null, 2)}`);

  const result = await foodMapAPI.getSrcToManyFastestRoutes(srcPos, updatedHubs);
  // take the top one
  if (result.length > 0) {
    Logger.info(`💚💚💚💚 _findCloestHub top: ${JSON.stringify(result[0], null, 2)}`);
    return result[0];
  } 
  return {};
  
  
}

module.exports = {
  findAllHub: _findAllHub,
  findClosestHub: _findClosestHub,
}
