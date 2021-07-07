const Logger = require('../utils/Logger');
const axios = require('axios');
const keyManager = require('../key').manager;

// srcPos: {latitude, longitude}
// destPos: {latitude, longitude}
const _getSingleRoute = async (srcPos, destPos) => {
  let groutes = [];
  let err = 0;
  do {
    if (typeof srcPos === 'undefined' || typeof destPos === 'undefined') {
      err += 1;
      break;
    }

    if (typeof srcPos.latitude !== 'string' || typeof srcPos.longitude !== 'string' ||
    typeof destPos.latitude !== 'string' || typeof destPos.longitude !== 'string') {
      err += 1;
      break;
    }

    // parse int
    if (isNaN(parseInt(srcPos.latitude, 10))) {
      break;
    }

    if (isNaN(parseInt(srcPos.longitude, 10))) {
      break;
    }

    if (isNaN(parseInt(destPos.latitude, 10))) {
      break;
    }

    if (isNaN(parseInt(destPos.longitude, 10))) {
      break;

    }

    const _mapKey = keyManager.getMapKey().value;

    // ASSERT data are correct form the url
    let mapAPI = `https://atlas.microsoft.com/route/directions/json?subscription-key=${_mapKey}&api-version=1.0&query=${srcPos.latitude},${srcPos.longitude}:${destPos.latitude},${destPos.longitude}`

    // take in srcPos, and destPos, return a route object
    await axios.get(mapAPI)
    .then(function (response) {
      // handle success      
      Logger.silly(`🗺🗺🗺 Map return: ${JSON.stringify(response.data.routes, null, 2)}`);

      // assign routes to global
      groutes = response.data.routes;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      Logger.error(`map test err: ${error}`);
    })
    .then(function () {
      // always executed
      Logger.error(`Finally > 🌐🌐🌐🌐🌐`);
    });

  } while (0);
  Logger.silly(`💛💛Ⓜ️💛💛 getSingleRoute executed: ${JSON.stringify(groutes, null, 2)}`);


  /**
   * {
   * srcPos,
   * destPos,
   * routes: []
   * }
   */
  return {srcPos, destPos, routes: groutes};
};

const _getSrcToManyRoutes = async (srcPos, arrayDestPos) => {
  // construct an array of promises
  let p = [];
  arrayDestPos.map(dest => {
    p.push(_getSingleRoute(srcPos, dest));
  })

  const res = await Promise.all(p);
  Logger.silly(`💙💜Ⓜ️💙💜 _getSrcToManyRoutes executed: ${JSON.stringify(res, null, 2)}`);

  return res;
}

const _getSrcToManyFastestRoutes = async (srcPos, arrayDestPos) => {
  // construct an array of promises
  let p = [];
  arrayDestPos.map(dest => {
    p.push(_getSingleRoute(srcPos, dest));
  })
  const res = await Promise.all(p);

  // order by time
  res.sort((a,b) => {

    if (a.routes.length > 0 && b.routes.length > 0) {
      // ascending ==> fastest first
      return a.routes[0].summary.travelTimeInSeconds - b.routes[0].summary.travelTimeInSeconds
    }
    
    // if they are both == 0
    if (a.routes.length === 0 || a.routes.length === 0) {
      return 0;
    }

    if (a.routes.length <= 0) {
      // b is valid
      return 1;
    }

    // if (b.route.length <= 0) {
      // a is valid
      return -1;
    // }
    
  });
  Logger.silly(`💙💜Ⓜ️💙💜 _getSrcToManyFastestRoutes executed: ${JSON.stringify(res, null, 2)}`);

  return res;
} 

// API Map handles  

module.exports = {
  getSingleRoute: _getSingleRoute,
  getSrcToManyRoutes: _getSrcToManyRoutes,  
  getSrcToManyFastestRoutes: _getSrcToManyFastestRoutes,
}
