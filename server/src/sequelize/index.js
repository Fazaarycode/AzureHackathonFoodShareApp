const Sequelize = require('sequelize');
const Logger = require('../utils/Logger');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class SetupSequelize {
    constructor() {
        this.dbORM = 'na'
        this.producerModel = 'na'
        this.consumerModel = 'na'
        this.consumerHubModel = 'na'
        this.collectorModel = 'na'
        this.eachFoodServingModel = 'na'
        this.foodBatchModel = 'na'
        // this.setupORM();

        Logger.info(`ℹ️ SetupSequelize()`);
        // this.initializeOTPRenewalForHubs();
        // this.otpRenewalInterval = setInterval(() => {
        //     this.initializeOTPRenewalForHubs()
        // }, 86400000) // Once per day
    }

    async initialise(dbPass) {
        this.dbORM = new Sequelize('foodshareapp', 'runtimeterror', dbPass, {
            dialect: 'mssql',
            host: 'foodsharepp.database.windows.net',
            port: 1433, // Default port
            logging: false, // disable logging; default: console.log,
            encrypt: true,

            dialectOptions: {
                requestTimeout: 30000 // timeout = 30 seconds
            }
        });
        this.setupSequelizeModels();

        ///this.queryAllConsumers();
        this.count = 0;
        //this.checkConnection();

        this.initializeOTPRenewalForHubs();
        this.otpRenewalInterval = setInterval(() => {
            this.initializeOTPRenewalForHubs()
        }, 86400000) // Once per day

        Logger.info(`🧡 Database initialise()`);
    }

    async checkConnection() {
        this.count += 1;
        this.dbORM.authenticate()
            .then(() => {
                Logger.info(`💜 Connection has been established successfully. ${this.count}`);
            })
            .catch(err => {
                Logger.error(`💔 Unable to connect to the database: ${err}`);
            });
    }

    async initDatabase() {
        this.migrateDatabase();
    }

    async initializeOTPRenewalForHubs() {
        Logger.info(`🔷 initializeOTPRenewalForHubs()`);
        let allConsumerHubs = await this.consumerHubModel.findAll();
        try {
            await Promise.all((allConsumerHubs).map(async eachHub => {
                let consumerHubId = eachHub.dataValues.consumerHubId;
                let newOtp = Buffer.from(`${eachHub.dataValues.consumerHubName}${new Date().toISOString()}`).toString('base64');
                await this.consumerHubModel.update(
                    {
                        OTP: newOtp.slice(0, 4).toUpperCase()
                    },
                    {
                        where: {
                            consumerHubId,
                        }
                    });
            }))
        } catch (err) {
            Logger.error(`Failed to Renew OTPs! due to ${err}) :( )`)
        }
    }
    async _verifyOTP(payload, consumerHubModel) {
        try {
            this.consumerHubModel = consumerHubModel;
            Logger.info(`🧡 _verifyOTP()`);
            let allConsumerHubs = await this.consumerHubModel.findOne({
                where: {
                    consumerHubId: payload.consumerHubId,
                    otp: payload.otp,
                }
            });
            if (allConsumerHubs) {
                Logger.info(`💚 OTP verified against HUB !`)
                return "success";
            }
            else return "failure";
        } catch (err) {
            Logger.error(`Verification Failed due to ${err}`)
        }
    }
    // async createDummy() {
    //     let Dummy = this.dbORM.define('dummy', {
    //         description: Sequelize.STRING
    //     });

    //     Dummy.sync().then(() => {
    //         Logger.info('New table created');
    //     }).finally(() => {
    //         this.dbORM.close();
    //     })
    // }
    async setupDummyModel() {
        this.dummyModel = this.dbORM.define('dummy', {
            description: Sequelize.STRING
        });
    }

    async createDummyTable() {
        this.dummyModel.sync().then(() => {
            Logger.info('New table created');
        }).finally(() => {
            this.dbORM.close();
        })
    }

    async dropDummyTable() {
        this.dummyModel.drop().then(() => {
            Logger.info('table deleted');
        }).finally(() => {
            sequelize.close();
        });
    }

    async migrateDatabase() {

        // const tableHandles = [
        //     {tableModel: this.producerModel, seeder: this.seedProducer, name: "producer"},
        //     // {tableModel: this.collectorModel, name: "collector"},
        //     // {tableModel: this.consumerHubModel, name: "consumerHub"},
        //     // {tableModel: this.consumerModel, name: "consumer"},
        //     // {tableModel: this.eachFoodServingModel, name: "eachFoodServing"},
        //     // {tableModel: this.foodBatchModel, name: "foodBatchModel"}            
        // ];

        this.seedProducer();

        Logger.info(`✅ tables migrated`);

    }



    seedProducer() {

        Logger.info(`seedProducer START`);
        let producers = [
            { producerName: 'John' },
            { producerName: 'Tony' },
            { producerName: 'Ben' }
        ];

        this.dbORM.sync({ force: true }).then(() => {
            this.producerModel.bulkCreate(producers, { validate: true }).then(() => {
                Logger.info(`✅ Producer table seeded`);
            }).catch((err) => {
                Logger.info(`failed to create producers ${err}`);
            }).finally(() => {
                this.dbORM.close();
            });

        });

        Logger.info(`seedProducer END`);
    }

    setupSequelizeModels() {

        this.setupProducerModel();
        this.setupCollectorModel();
        this.setupConsumerHubModel();
        this.setupConsumerModel();
        this.setupEachFoodServingsModel();
        this.setupFoodBatchModel();

        // this.setDummyModel();
    }

    setupProducerModel() {
        // Producer Model
        this.producerModel = this.dbORM.define('producer', {
            producerId: {
                primaryKey: true,
                type: Sequelize.STRING
            },
            producerName: Sequelize.STRING,
            latitude: Sequelize.STRING,
            longitude: Sequelize.STRING,
            password: Sequelize.STRING,
            createdAt: Sequelize.DATE,
            email: Sequelize.STRING,
        }, {
            freezeTableName: true, // IMPORTANT
            timestamps: false, // IMPORTANT
        });
        this.producerModel.removeAttribute('id'); // IMPORTANT
    }
    setupCollectorModel() {
        // Collector Model
        this.collectorModel = this.dbORM.define('collector', {
            collectorId: {
                primaryKey: true,
                type: Sequelize.STRING
            },
            collectorName: Sequelize.STRING,
            latitude: Sequelize.STRING,
            longitude: Sequelize.STRING,
            vehicleId: Sequelize.STRING,
            vehicleType: Sequelize.STRING,
            password: Sequelize.STRING,
            createdAt: Sequelize.DATE,

        }, {
            freezeTableName: true, // IMPORTANT
            timestamps: false, // IMPORTANT
        });
        this.collectorModel.removeAttribute('id'); // IMPORTANT
    }
    setupConsumerHubModel() {
        // Consumer Hub Model
        this.consumerHubModel = this.dbORM.define('consumerHub', {
            consumerHubId: {
                primaryKey: true,
                type: Sequelize.STRING
            },
            consumerHubName: Sequelize.STRING,
            latitude: Sequelize.STRING,
            longitude: Sequelize.STRING,
            hubCapacity: Sequelize.STRING,
            password: Sequelize.STRING,
            createdAt: Sequelize.DATE,
            OTP: Sequelize.STRING,

        }, {
            freezeTableName: true, // IMPORTANT
            timestamps: false, // IMPORTANT
        });
        this.consumerHubModel.removeAttribute('id'); // IMPORTANT
    }
    setupConsumerModel() {
        // Consumer Model
        this.consumerModel = this.dbORM.define('consumer', {
            consumerId: Sequelize.STRING,
            consumerName: Sequelize.STRING,
            ethnicity: Sequelize.STRING,
            age: Sequelize.NUMBER,
        }, {
            freezeTableName: true, // IMPORTANT
            timestamps: false, // IMPORTANT
        });
        this.consumerModel.removeAttribute('id'); // IMPORTANT
    }

    setupEachFoodServingsModel() {
        this.eachFoodServingModel = this.dbORM.define('eachFoodServings', {
            servingId: {
                primaryKey: true,
                type: Sequelize.STRING,
            },
            foodCondition: Sequelize.STRING,
            foodCapacity: Sequelize.STRING,
            cuisine: Sequelize.STRING,
            // producerId: Sequelize.STRING,
            allergicIngredients: Sequelize.STRING, // call JSON.stringify()
            preparationDate: Sequelize.DATE,
            // expirationDate: Sequelize.DATE,
            createdAt: Sequelize.DATE,
        }, {
            freezeTableName: true, // IMPORTANT
            timestamps: false, // IMPORTANT
        });
        this.eachFoodServingModel.removeAttribute('id'); // IMPORTANT
    }

    setupFoodBatchModel() {
        this.foodBatchModel = this.dbORM.define('foodBatch', {
            batchId: {
                primaryKey: true,
                type: Sequelize.STRING,
            },
            collectorId: Sequelize.STRING,
            producerId: Sequelize.STRING,
            destinationHubId: Sequelize.STRING,
            deliveryStatus: Sequelize.STRING,
            totalBoxCount: Sequelize.NUMBER,
            deliveryInitiationDate: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        }, {
            freezeTableName: true, // IMPORTANT
            timestamps: false, // IMPORTANT
        });
        this.foodBatchModel.removeAttribute('id'); // IMPORTANT
    }

    async getProducerModel() {
        return this.producerModel;
    }

    async getCollectorModel() {
        return this.collectorModel;
    }

    async getConsumerHubModel() {
        return this.consumerHubModel;
    }

    async getFoodBatchModel() {
        return this.foodBatchModel;
    }

    async getEachFoodServingModel() {
        return this.eachFoodServingModel;
    }
    async queryAllProducers() {
        try {
            let allProducers = await this.producerModel.findAll();
            console.log('Producer Model : ', allProducers)

        } catch (err) {
            console.log('Error Querying ', err)
        }
    }
    async queryAllCollectors() {
        let allCollectors = [];
        try {
            allCollectors = await this.collectorModel.findAll();
            console.log('Collector Model : ', allCollectors)

        } catch (err) {
            console.log('Error Querying ', err)
        }

        return allCollectors;
    }

    async queryAllConsumers() {
        let allConsumers = [];
        try {
            allConsumers = await this.consumerModel.findAll();
            console.log('Consumers Model : ', allConsumers)

        } catch (err) {
            console.log('Error Querying ', err)
        }

        return allConsumers;
    }

    async queryAllConsumerHubs() {
        let allHubs = [];
        let allDestinationHubsCoords = [];
        try {
            allHubs = await this.consumerHubModel.findAll();
            // console.log('allConsumerHubs Model : ', allHubs)
            allHubs.forEach(eachHub => {
                allDestinationHubsCoords.push({
                    latitude: eachHub.dataValues.latitude,
                    longitude: eachHub.dataValues.longitude,
                    hubId: eachHub.dataValues.consumerHubId,
                    hubName: eachHub.dataValues.consumerHubName,
                })
            })
            // console.log('Hubs coords ', allDestinationHubsCoords)
        } catch (err) {
            console.log('Error Querying ', err)
        }
        return {
            allHubs,
            allDestinationHubsCoords
        };
    }

    async queryAllfoodBatch() {
        try {
            let allFoodBatch = await this.foodBatchModel.findAll();
            console.log('allFoodBatch Model : ', allFoodBatch)

        } catch (err) {
            console.log('Error Querying ', err)
        }
    }

    async queryAllfoodBatchPerCollector(collectorId = '') {
        try {
            let allFoodBatchPerCollector = await this.foodBatchModel.findAll({
                where: {
                    collectorId
                }
            });
            console.log('allFoodBatchPerCollector : ', allFoodBatchPerCollector)

        } catch (err) {
            console.log('Error Querying ', err)
        }
    }

    async queryAllServingsPerProducer(producerId = '') {
        try {
            let allServingsPerProducer = await this.eachFoodServingModel.findAll({
                where: {
                    producerId
                }
            });
            console.log('allServingsPerProducer  : ', allServingsPerProducer)

        } catch (err) {
            console.log('Error Querying ', err)
        }
    }

    async queryAllServings() {
        try {
            let allServings = await this.eachFoodServingModel.findAll();
            console.log('allServings  : ', allServings)

        } catch (err) {
            console.log('Error Querying ', err)
        }
    }

    async _getProducerLoginInfo(payload, producerModel) {
        Logger.info(' __getProducerLoginInfo start')
        this.producerModel = producerModel;
        Logger.info('PAYLOAD' + JSON.stringify(payload))
        try {
            const loggedInProducer = await this.producerModel.findOne({
                where: {
                    email: payload.email,
                    password: payload.password
                }
            })
            console.log('loggedInProducer Info: ', loggedInProducer)
            return {
                loggedInProducer
            }
        } catch (err) {
            Logger.error('Error fetching producer login information.' + err)
        }
    }


    async _getCollectorLoginInfo(payload, collectorModel) {
        Logger.info(' _getCollectorLoginInfo start')
        this.collectorModel = collectorModel;
        Logger.info('PAYLOAD' + JSON.stringify(payload))
        try {
            const loggedInCollector = await this.collectorModel.findOne({
                where: {
                    email: payload.email,
                    password: payload.password
                }
            })
            return {
                loggedInCollector
            }
        } catch (err) {
            Logger.error('Error fetching collector login information.' + err)
        }
    }

    async _getConsumerHubLoginInfo(payload, consumerHubModel) {
        Logger.info(' _getConsumerHubLoginInfo start')
        Logger.info('PAYLOAD for Consumer Hub Login ' + JSON.stringify(payload))
        try {
            const loggedInConsumerHub = await this.consumerHubModel.findOne({
                where: {
                    email: payload.email,
                    password: payload.password
                }
            })
            console.log('loggedInConsumerHub Info: ', loggedInConsumerHub)
            return {
                loggedInConsumerHub
            }
        } catch (err) {
            Logger.error('Error fetching consumerHub login information.' + err)
        }
    }
    /**
     * add one serve of food serve to db
     * @param {*} foodserve incoming food serve to add into db
     */
    // return a promise
    async _addFoodServing(foodserve) {

        Logger.info(`🔷 _addFoodServing START`);

        let payloadCreated = {};
        let status = 0;
        let ingStr = '';

        try {
            Logger.info(`🔷 _addFoodServing dbPayload: allergic type = ##${typeof foodserve.allergicIngredients}##`);
            if (typeof foodserve.allergicIngredients !== 'string') {
                ingStr = foodserve.allergicIngredients.join();
            }
            else {
                ingStr = foodserve.allergicIngredients;
            }

            const dbPayload = {
                // servingId: uuidv4(),
                servingId: foodserve.id,
                foodCondition: foodserve.foodCondition,
                foodCapacity: foodserve.foodCapacity,
                cuisine: foodserve.cuisine,
                preparationDate: Sequelize.fn('GETDATE'),
                createdAt: Sequelize.fn('GETDATE'),
                allergicIngredients: ingStr,

            };

            Logger.info(`🔷 _addFoodServing dbPayload: ${JSON.stringify(dbPayload, null, 2)}`);

            payloadCreated = await this.eachFoodServingModel.create(dbPayload);

            Logger.info(`💚 Created! ${JSON.stringify(payloadCreated, null, 2)}`);
            return Promise.resolve(payloadCreated);

        } catch (err) {
            console.log(err);
            Logger.info(`🛑 err occurred on _addFoodServing ${err}`);
            return Promise.reject(err);
        }

        // return new Promise({ status, payloadCreated });
    }

    async mutationAddFoodBatch(payload) {
        try {
            Logger.info(`🔷🔷 mutationAddFoodBatch START`);
            payload.preparationDate = Sequelize.fn('GETDATE');
            payload.createdAt = Sequelize.fn('GETDATE');
            // payload.deletedAt = Sequelize.fn('GETDATE');
            payload.deliveryInitiationDate = Sequelize.fn('GETDATE');
            console.log("payload to add ", payload)

            const createFoodBatch = await this.foodBatchModel.create(payload);
            console.log('Food Batch created! ', createFoodBatch)
            return createFoodBatch;
        } catch (error) {
            console.log(`Error creating an entry for Food Batch ${error}`)
        }
    }
    async mutationAddEachServings(payloads) {
        // For an array of each servings:
        // use for..of and create record for each serving
        Logger.info(`🔷🔷 mutationAddEachServings START`);
        let results = [];

        payloads.forEach(x => {
            let res = this._addFoodServing(x);
            // Logger.info(`💚💚 mutationAddEachServings res: ${JSON.stringify(res, null, 2)}`);
            // if (res.status === 0) {
            //     results.push(res.payloadCreated);
            // }
        })
        /*
        await Promise.all(payloads.map(p => {
            const res = this._addFoodServing(results, p).then(function(data) {
                Logger.info(`💚💚 mutationAddEachServings data: ${JSON.stringify(data, null, 2)}, res = ${res}`);
                results.push(data);
            });
        })).then((values) => {
            Logger.info(`🔷🔷 mutationAddEachServings .then: ${JSON.stringify(values, null, 2)}`);        
        });
        */

        Logger.info(`🔷🔷 mutationAddEachServings END: ${JSON.stringify(results, null, 2)}`);
        return results;
    }

}

module.exports = {
    db: new SetupSequelize()
};