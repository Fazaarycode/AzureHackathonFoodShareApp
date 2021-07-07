CREATE TABLE collector(
    collectorId VARCHAR(255) NOT NULL,
    vehicleId VARCHAR(25) NOT NULL,
    vehicleType VARCHAR(64) NOT NULL,
    collectorName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL
    PRIMARY KEY(collectorId)
)

CREATE TABLE producer(
	producerId VARCHAR(255) NOT NULL,  
    producerName VARCHAR(255) NOT NULL,
    latitude VARCHAR(64) NOT NULL,
    longitude VARCHAR(64) NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY(producerId)
);


CREATE TABLE consumerHub(
	consumerHubId VARCHAR(255) NOT NULL,  
    consumerHubName VARCHAR(255) NOT NULL,
    latitude VARCHAR(64) NOT NULL,
    longitude VARCHAR(64) NOT NULL,
    hubCapacity INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY(consumerHubId)
);


CREATE TABLE consumer(
    consumerId VARCHAR(255) NOT NULL,
    consumerName VARCHAR(255) NOT NULL,
    ethnicity VARCHAR(64) NOT NULL,
    age INT NULL,
    PRIMARY KEY(consumerId)
    createdAt DATETIME NOT NULL
)


CREATE TABLE eachFoodServings(
    servingId VARCHAR(255) NOT NULL,
    foodCondition VARCHAR(255) NOT NULL,
    foodCapacity INT NOT NULL,
    cuisine VARCHAR(64) NOT NULL,
    preparationDate DATETIME NOT NULL,
    allergicIngredients VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL
    PRIMARY KEY(servingId)
)


CREATE TABLE foodBatch(
    batchId VARCHAR(255) NOT NULL,
    PRIMARY KEY(batchId),
    collectorId VARCHAR(255) FOREIGN KEY REFERENCES collector(collectorId)
                              ON UPDATE CASCADE,
    producerId VARCHAR(255) FOREIGN KEY REFERENCES producer(producerId)
                              ON UPDATE CASCADE,
    destinationHubId VARCHAR(255) FOREIGN KEY REFERENCES consumerHub(consumerHubId),
    createdAt DATETIME NOT NULL,
    deletedAt DATETIME NULL,
    deliveryStatus VARCHAR(128) NOT NULL,
    totalBoxCount INT NOT NULL,
    totalRedBox INT NULL,

    deliveryInitiationDate DATETIME NOT NULL,
);

