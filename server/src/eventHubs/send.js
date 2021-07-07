const { EventHubProducerClient } = require("@azure/event-hubs");

// MOVE TO VAULT!
/**
 * 
 * Test 2
 */

const connectionString = "";    
const eventHubName = "";



async function sendToEventHub(nearestCollector) {

  // Create a producer client to send messages to the event hub.
  const producer = new EventHubProducerClient(connectionString, eventHubName);

  // Prepare a batch of three events.
  const batch = await producer.createBatch();
  batch.tryAdd({
    body: {
      collectorId: nearestCollector.destPos.dataValues.collectorId,
      collectorName: nearestCollector.destPos.dataValues.collectorName,
      producerLatitude: nearestCollector.srcPos.latitude,
      producerLongitude: nearestCollector.srcPos.longitude
    },
  })
  // Send the batch to the event hub.
  await producer.sendBatch(batch);

  // Close the producer client.
  await producer.close();

  console.log("Collector Job batch has been sent to the event hub");
}

// main().catch((err) => {
//   console.log("Error occurred: ", err);
// });

module.exports = sendToEventHub;
