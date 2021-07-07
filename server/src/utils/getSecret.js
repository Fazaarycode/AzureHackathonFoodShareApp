const Logger = require('./Logger');

const vaultName = require('../config/general.json').vault.name;
const KVUri = `https://${vaultName}.vault.azure.net`;

let client;

//-------------------------------------------------------------------
// Default Azure Credentials (Local)
//-------------------------------------------------------------------
if (process.env.ENVIRONMENT !== 'production') {
  const { DefaultAzureCredential } = require("@azure/identity");
  const { SecretClient } = require("@azure/keyvault-secrets");
  const credential = new DefaultAzureCredential();
  client = new SecretClient(KVUri, credential);
  Logger.info(`🖥🖥🖥 Running Locally with user@domain credential`);
}
else {
//-------------------------------------------------------------------
// Managed Identity Credential (Cloud)
//-------------------------------------------------------------------
  const {ManagedIdentityCredential} = require('@azure/identity');
  const {SecretClient} = require('@azure/keyvault-secrets');
  const credential = new ManagedIdentityCredential();
  client = new SecretClient(KVUri, credential);
  Logger.info(`💭💭💭 Running in Cloud with Managed Identity Credential`);
}

//-------------------------------------------------------------------

const _getSecret = async (secretName) => {
  const secret = await client.getSecret(secretName);
  Logger.info(`🔐🔐🔐🔐 _getSecret(${secretName}: ${JSON.stringify(secret, null, 2)}`);
  return secret;
}

module.exports = {
  getSecret: _getSecret
}