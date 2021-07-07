const Logger = require('../utils/Logger');
const secretVault = require('../utils/getSecret');

const config = require('../config/general.json');

class KeyManager {
  constructor() {
      this._mapKey = '';
      this._initialised = false;            
  }

  async initialise() {

    // get mapKey
    this._mapKey = await secretVault.getSecret(config.map.keySecretName);
    this._dbPass = await secretVault.getSecret(config.db.passSecretName);

    this._initialised = true;

  }

  isInitialised() {
    return this._initialised;
  }

  getMapKey() {
    return this._mapKey;
  }

  getDbPass() {
    return this._dbPass;
  }

}

module.exports = {
  manager: new KeyManager()
};