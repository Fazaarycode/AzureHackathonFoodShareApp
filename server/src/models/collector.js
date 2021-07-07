const Logger = require('../utils/Logger');
const db = require('../sequelize').db;
// const axios = require('axios');
const foodMapAPI = require('../utils/mapAPI');

// find all collectors
const _findAllCollector = async () => {  
  return await db.queryAllCollectors();  
}

// srcPos ={latitude, longitude} Producer
// go thur the entire record of collector and find the quickest available 
const _findClosestCollector = async (srcPos) => {

  let collectors = await db.queryAllCollectors();
  let updatedCollectors = collectors.map(c => {
    // make sure property lat and long exist
    let copyCollector = {...c};
    // copyCollector['lat'] = c.latitude;
    // copyCollector['long'] = c.longitude;
    return copyCollector;
  });

  const result = await foodMapAPI.getSrcToManyFastestRoutes(srcPos, updatedCollectors);
  // take the top one
  if (result.length > 0) {
    Logger.info(`💚💚💚💚 _findClosestCollector top: ${JSON.stringify(result[0], null, 2)}`);
    return result[0];
  } 
  return {};
  
  
}

module.exports = {
  findAllCollector: _findAllCollector,
  findClosestCollector: _findClosestCollector,
}
