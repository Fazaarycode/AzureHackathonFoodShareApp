DROP TABLE IF EXISTS dbo.foodBatch;
DROP TABLE IF EXISTS dbo.collector;
DROP TABLE IF EXISTS dbo.producer;
DROP TABLE IF EXISTS dbo.consumerHub;
DROP TABLE IF EXISTS dbo.consumer;
DROP TABLE IF EXISTS dbo.eachFoodServings;


CREATE TABLE collector(
    collectorId VARCHAR(255) NOT NULL,
    collectorName VARCHAR(255) NOT NULL,
    latitude VARCHAR(64) NOT NULL,
    longitude VARCHAR(64) NOT NULL,
    vehicleId VARCHAR(25),
    vehicleType VARCHAR(64),    
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY(collectorId),
    email VARCHAR(255)
)

CREATE TABLE producer(
	producerId VARCHAR(255) NOT NULL,  
    producerName VARCHAR(255) NOT NULL,
    latitude VARCHAR(64) NOT NULL,
    longitude VARCHAR(64) NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY(producerId),
    email VARCHAR(255)
);


CREATE TABLE consumerHub(
	consumerHubId VARCHAR(255) NOT NULL,  
    consumerHubName VARCHAR(255) NOT NULL,
    latitude VARCHAR(64) NOT NULL,
    longitude VARCHAR(64) NOT NULL,
    hubCapacity INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,    
    PRIMARY KEY(consumerHubId),
    email VARCHAR(255),
    OTP VARCHAR(4) NULL
);
--    password VARCHAR(255) NOT NULL,


CREATE TABLE consumer(
    consumerId VARCHAR(255) NOT NULL,
    consumerName VARCHAR(255) NOT NULL,
    ethnicity VARCHAR(64) NOT NULL,
    age INT NULL,
    PRIMARY KEY(consumerId),
    createdAt DATETIME NOT NULL
)


CREATE TABLE eachFoodServings(
    servingId VARCHAR(255) NOT NULL,
    foodCondition VARCHAR(255) NOT NULL,
    foodCapacity INT NOT NULL,
    cuisine VARCHAR(64) NOT NULL,
    preparationDate DATETIME NOT NULL,
    allergicIngredients VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY(servingId)
)


CREATE TABLE foodBatch(
    batchId VARCHAR(255) NOT NULL,
    PRIMARY KEY(batchId),
    producerId VARCHAR(255) NOT NULL,
    collectorId VARCHAR(255) NULL,
    destinationHubId VARCHAR(255) NULL,
    -- collectorId VARCHAR(255) FOREIGN KEY REFERENCES collector(collectorId)
    --                           ON UPDATE CASCADE,
    -- producerId VARCHAR(255) FOREIGN KEY REFERENCES producer(producerId)
    --                           ON UPDATE CASCADE,
    -- destinationHubId VARCHAR(255) FOREIGN KEY REFERENCES consumerHub(consumerHubId),
    createdAt DATETIME NOT NULL,
    deletedAt DATETIME NULL,
    deliveryStatus VARCHAR(128) NOT NULL,
    totalBoxCount INT NOT NULL,
    
    deliveryInitiationDate DATETIME NOT NULL
);

INSERT INTO collector (collectorId, collectorName, latitude, longitude, password, createdAt, email) VALUES
('c9c47ba6-7565-40c2-a5ad-2125ae93c881', 'Cherrybrook Taxi', '-33.72495396478162','151.05162632278288', 'Zm8#7CUn8qjc', GETDATE(), 'first@collector.com'),
('5e323268-ff7e-4186-99a3-36b5e69eeb82', 'Roseville Courier', '-33.78409680479919', '151.182602606439', '1b!8Ecj&b4@V', GETDATE(), 'second@collector.com'),
('e5b16f32-b27a-4bd8-b716-caf16156fbd5', 'Opera House Bike', '-33.85688648316641', '151.21556281304262', 'Zm8#7CUn8qjc', GETDATE(),''),
('626ef45b-c1b3-4a3e-b055-61a4430e6613', 'Bronte Delivery', '-33.90241180636702', '151.2624291903548', 'WpF2zRDW$wmP', GETDATE(),''),
('796a1606-0af5-4bc0-84ed-53d0fbdd16e9', 'DHL', '-33.921874520579856', '151.17883352909408', '&eCZNwY4T^^c', GETDATE(),''),
('8fffc612-8da0-45c3-9788-d63759a3b188', 'Udaya Delivery', '-33.80885120606655', '150.9669898028451', 'AqBDEb^Y6XYR', GETDATE(),'');


INSERT INTO producer (producerId, producerName, latitude, longitude, password, createdAt, email) VALUES
('b3ffe0d7-f915-4ea0-b280-d92c5137fbf4', 'Fort Street Kitchen', '-33.86023580352346', '151.20539013407318', 'Z@Qx8FBjg&C1', GETDATE(), 'first@producer.com'),
('ccc0f88f-b12b-4b4d-ad59-ad8db5077ba4', 'Chatswood Golf Clud Kitchen', '-33.80080848896953', '151.1563057091003', 'frs@SFS5Xq72', GETDATE(), 'second@producer.com'),
('653feafa-beed-45e3-a6da-e3c09c1ef3e4', 'Maquarie Uni Centeen', '-33.770847463589845', '151.11373368799306', 'ue$K2M8%512$', GETDATE(), 'third@producer.com'),
('04aa5e50-84ec-4746-aead-e511e655c7eb', 'Campbelltown Kitchen', '-34.05824658815076', '150.8220854465373', '75^Rj7ST#r#V', GETDATE(), 'fourth@producer.com'),
('1f359296-6b04-4521-a064-c4ba9a598d75', 'Erskine Park Cafe', '-33.807410436826935', '150.80578047993893', 'skmp8*95weWE', GETDATE(), 'fifth@producer.com');


INSERT INTO consumerHub (consumerHubId, consumerHubName, latitude, longitude, hubCapacity, password, createdAt, email) VALUES
('945cb083-452f-4c75-beda-bb9986e6313a', 'ASQ', '-33.86489678881689', '151.2079743746602', 1000, 'B*kMp6bKt3yS', GETDATE(), 'first@consumerHub.com'),
('aa6b37f1-ac22-4128-9fae-19eeb85f4a2d', 'Calyx', '-33.8657163880459', '151.21534508470836', 1000, 'AaWRpeMP&5Gp', GETDATE(), 'second@consumerHub.com'),
('983c3abd-c191-4998-b452-ab1919667b16', 'Hyde Park', '-33.87323049912521', '151.2110964661145', 1000, 'XWu%f6kSHJ@3', GETDATE(), ''),
('2f81eaab-8a73-458a-896b-5013e905bf62', 'Centennial Park', '-33.89471306284626', '151.23743665248705', 1000, '5^C$y8sx#3%K', GETDATE(), ''),
('1399fd86-5144-4735-812f-8a036a09541c', 'Sydney Airport', '-33.940849485211615', '151.17508066009788', 1000, 'hR!dmxTa7!W@', GETDATE(), ''),
('b71f4c08-20c2-403a-a43f-837de4e02660', 'Sydney Olympic Park Aquatic Centre', '-33.84710954813919', '151.07332539367746', 1000, 'UeJAC5LH$8TX', GETDATE(), ''),
('cf89789f-a362-4465-b762-c221aafe9cad', 'Westmead Hospital', '-33.80417384735456', '150.98730515834706', 1000, 't9%tXavLx@fc', GETDATE(), ''),
('e3fd00fc-17d6-48f4-b6f6-145aed7cd50f', 'Land Cove National Park', '-33.7920600509419', '151.15400623982725', 1000, 'aR$xHzM62Dtg', GETDATE(), ''),
('d8a6d350-4fcc-4741-887a-89672720ce82', 'Chatswood Chase', '-33.79397440944195', '151.1842007521664', 1000, '1E&bRRLtUwF@', GETDATE(), ''),
('3191ed6e-156c-4082-9699-fc25793c24e9', 'Macquarie Centre', '-33.77212711983427', '151.1334319013016', 1000, 'Yw23#f78q#Nm', GETDATE(), '');
