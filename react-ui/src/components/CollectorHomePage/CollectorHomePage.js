import React, { useEffect } from 'react';
// Import Local components
import Navbar from '../Navbar/Navbar';
import DashBoard from '../DashBoard/DashBoard';

// Helper function
import lookForJobs from './helper/lookForJobs'
// React Bootstrap Imports
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";

// Modal
import MyVerticallyCenteredModal from '../Modals/BackdropModal/VerticalBackdropModal';

// Outside packages
import { v4 as uuidv4 } from 'uuid';
// Azure Maps local component
import CollectorConsumerHubMap from '../Maps/CollectorConsumerHubMap';

// Import Stylesheet
import './CollectorHomePage.scss';
const CollectorHomePage = (props) => {

  /**
   * We'd need a query to SQLDB to retrieve all open delivery requests relevant to this collector ( in terms of Distance )
   */
  const [modalShow, setModalShow] = React.useState(false);
  const [totalServingsCount, setTotalServingsCount] = React.useState(0);
  const [hubPreference, setHubPreference] = React.useState('');
  const [foodContainerId, setFoodContainerId] = React.useState('');
  const [producerId, setProducerId] = React.useState('');
  const [acceptJob, updateAcceptJob] = React.useState('show-toaster');
  const [loggedInCollectorInfo, setLoggedInCollectorInfo] = React.useState([])
  const [loggedInProducerInfo, setLoggedInProducerInfo] = React.useState([])
  const [selectedHubInfo, updateSelectedHubInfo] = React.useState([]);
  const [startDelivery, updateStartDelivery] = React.useState(false);
  const [allHubs, setAllHubs] = React.useState([]);
  const [reachProducerLocation, updateReachProducerLocation] = React.useState('not-reached');
  const [routeToProducer, setRouteToProducer] = React.useState([]);

  // This is retrieved from backend and added to state
  let baseUrl;

  useEffect(() => {
    async function findLoginTypeAndFetchClosestRoutes() {
      let local;
      if (props.location.query && props.location.query.producerId) {
        // Producer as Collector
        setProducerId(props.location.query.producerId);
        setLoggedInProducerInfo(props.location.query.producerAllInfo);
        updateAcceptJob('show-form')
        // FIX THIS!
        local = props.location.query.producerAllInfo;
        const dataForProducer = await fetch(`${baseUrl}/getAllHubs?collectorId=${local.producerId}&latitude=${local.latitude}&longitude=${local.longitude}`)
        setAllHubs(await dataForProducer.json());
      } else {
        // Collector Persona
        setProducerId('')
        if (props.location.state) {
          setLoggedInCollectorInfo(props.location.state.collectorLoginInfo);
          local = props.location.state.collectorLoginInfo;
          // Collector to Hubs
          const dataForCollector = await fetch(`${baseUrl}/getAllHubs?collectorId=${local[0].collectorId}&latitude=${local[0].latitude}&longitude=${local[0].longitude}`)
          setAllHubs(await dataForCollector.json());
        }
      }
    }
    findLoginTypeAndFetchClosestRoutes();
  }, [props, loggedInCollectorInfo, loggedInProducerInfo]);

  const completeDelivery = (e) => {
    setModalShow(true);
  }

  useEffect(async () => {
    // Look for new jobs for collector from Azure Event hubs
    // setInterval(async () => {
    if (producerId === '' || producerId === null) { // Ofc producer doesnt want another job 
      await lookForJobs().catch(err => console.log(`Error looking for jobs ${err}`));
    }
    // }, 1000)
  }, [producerId])

  useEffect(async () => {
    if (reachProducerLocation === 'not-reached') {
      console.log('Log in collector ', loggedInCollectorInfo)
      // Collect distance from Collector to Producer
      // Event Hub Data will contain ProducerId ; 
      // Hardcoding for now: @TODO
      let producer = {
        producerId: 'b3ffe0d7-f915-4ea0-b280-d92c5137fbf4',
        latitude: '-33.80080848896953',
        longitude: '151.1563057091003',
      }
      if (loggedInCollectorInfo && loggedInCollectorInfo[0]) {
        // Producer to Collector;
        const routeToProducer = await fetch(`${baseUrl}/getRouteFromProducerToCollector?producerId=${producer.producerId}&producerLatitude=${producer.latitude}&producerLongitude=${producer.longitude}
          &collectorId=${loggedInCollectorInfo[0].collectorId}&collectorLatitude=${loggedInCollectorInfo[0].latitude}&collectorLongitude=${loggedInCollectorInfo[0].longitude}`
        );
        setRouteToProducer(await routeToProducer.json());

      }


    }
  }, [reachProducerLocation, loggedInCollectorInfo])
  // Constantly Look for new jobs
  // useEffect(() => {
  baseUrl = process.env.NODE_ENV === 'development' ?
    process.env.REACT_APP_BACKEND_DEV_ENDPOINT_URL :
    process.env.REACT_APP_BACKEND_PRODUCTION_ENDPOINT_URL;

  // jobSearchInterval = setInterval(async () => {
  //     let job = await fetch(``)
  // })
  // })
  // setFoodServingRequiringPickup([...foodServingRequiringPickup], mockData)
  // We need to assign producedId=collectorId if producers themselves want to pickup and deliver their food.
  // Identify the type of transaction: Query params
  if (props.location.query && props.location.query.collectorType) {
    if (props.location.query.collectorType === 'producer-as-collector') {
      let collectorId = props.location.query.producerId;
      // Prompt to confirm this action

    }
  }

  const assignJobToCollector = (e) => {
    // Pass in Job related info to the form
    // Show Collector to Hub
    updateAcceptJob('show-form');
    // Toast clicked: 
    // Clicking each hub should render different map
    // between Collector and ConsumerHub
  }

  /**
   * Open a popup (Carousel)
   * Ask a few informations about package
   * Then Input and begin transit
   */
  const updateTotalServingsCount = e => {
    setTotalServingsCount(e.target.value);
  }
  // Set Hub details
  const updateHubPreference = e => {
    setHubPreference(e.target.value);
    let localSelectedHub = allHubs.fastestHubs.find(val => val.destPos.hubName === e.target.value)
    console.log('LUL ', localSelectedHub)
    updateSelectedHubInfo(localSelectedHub);
    // Render Map for from Collector location to this hub.

  }
  // Generate ID and Begin Transaction to Hub
  const generateDataAndInitiateTransaction = e => {
    e.preventDefault();
    // get producerID from hub info 
    // find record in foodBatch with producerId and collectorId @TODO:
    // Find food batch record and update delivery status @TODO:
    updateStartDelivery(true);
    alert('Your delivery has started. You have 30minutes to reach')
    // Form Transaction Payload 
    // Update status of Producer payload (Transit)

  }
  return <div className="top-collector-home-container">
    <div className="collector-container">
      <div className="NavBar">
        <Navbar
          loggedinuser='' // collector name / producer name 
          loggedInCollectorInfo={loggedInCollectorInfo}
          loggedInProducerinfo={loggedInProducerInfo}
        />
      </div>
      {/* Collector is informed of any open delivery requests */}
      <div className="inner-container">
        {
          acceptJob === 'show-form'
            ?

            reachProducerLocation === 'not-reached'
              ?
              <>
                <div className="collector-to-producer">
                  <h1> Reach producers location </h1>
                  <div className="collector-to-producer-maps-placeholder">
                    <CollectorConsumerHubMap
                      destinationtoproducer={routeToProducer}
                      maptype='collector-to-producer'
                    />
                  </div>
                </div>
                <Button className="reach-producer-btn" onClick={(e) => updateReachProducerLocation('reached')}> Mark as Reached </Button>
              </>
              :
              <>
                <div className="dashboard">
                  <DashBoard
                    navItems={["Profile settings", "All Food Dispensed", "Distribution Frequency", "Most Common Food types distributed", "Request Distribution Boxes"]}
                  />
                </div>
                <div className="open-delivery-requests">
                  <div className="validate-servings-before-pickup">
                    <h1 className="header"> Validation and Selecting Destination to Hub location</h1>
                    <Form onSubmit={generateDataAndInitiateTransaction}>
                      {/* All available hubs for the collectors to choose from */}
                      <Form.Group controlId="formFoodCuisine">
                        <Form.Label>Select Hub </Form.Label>
                        <Form.Control as="select" custom
                          onChange={updateHubPreference}
                          value={hubPreference}
                        >
                          <option disable="true">Make a selection...</option>
                          {
                            allHubs && allHubs.fastestHubs && allHubs.fastestHubs.map((hub, index) => {
                              return <option key={index}
                              >{hub.destPos.hubName}
                              </option>
                            })
                          }
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="maxServingCapacity">
                        <Form.Label>Total number of boxes</Form.Label>
                        <Form.Control type="number" placeholder="Total individual servings count"
                          onChange={updateTotalServingsCount}
                          value={totalServingsCount}
                        />
                      </Form.Group>

                      <Form.Group controlId="foodContainerId">
                        <Form.Label>Food container #</Form.Label>
                        <Form.Control type="number" placeholder="Food Container Number from the box"
                          onChange={(e) => setFoodContainerId(e.target.value)}
                          value={foodContainerId}
                        />
                      </Form.Group>
                      <div className="delivery-buttons">
                        <Button variant="secondary" type="submit"
                          disabled={startDelivery}
                        >
                          Start Delivery
                       </Button>

                        <Button variant="secondary" type="button"
                          disabled={!startDelivery}
                          onClick={() => completeDelivery()}>
                          Complete Delivery
                    </Button>
                      </div>
                    </Form>
                    <MyVerticallyCenteredModal
                      modaltype='otp'
                      modalheading='Verify OTP with Hub'
                      selectedhubinfo={selectedHubInfo}
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                    />
                  </div>
                </div>  {/*  container ends here*/}
                <div className="maps-placeholder">
                  <CollectorConsumerHubMap
                    destinationhubmapdata={selectedHubInfo}
                    maptype='collector-to-hub'
                  />
                </div>
              </>










            :
            <div className="collector-search-jobs-landing">
              <div className="dashboard">
                <DashBoard
                  navItems={["Profile settings", "All Food Dispensed", "Distribution Frequency", "Most Common Food types distributed", "Request Distribution Boxes"]}
                />
                {/* Popup Component arises here if Job is found  */}
              </div>
              <div className="search-jobs">
                <h1> Active jobs.... </h1>
                <div className="open-jobs-toasts">
                  <>
                    <Toast className="toaster" onClick={(e) => { assignJobToCollector() }}>
                      <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                        <strong className="mr-auto">Job Notifications</strong>
                        <small>just now</small>
                      </Toast.Header>
                      <Toast.Body>You got a new pick up order at Time:  {new Date().toLocaleTimeString()}</Toast.Body>
                    </Toast>
                    <Toast className="toaster">
                      <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                        <strong className="mr-auto">Job Notifications</strong>
                        <small>2 seconds ago</small>
                      </Toast.Header>
                      <Toast.Body>Heads up, Job found ... Take ? </Toast.Body>
                    </Toast>
                  </>
                </div>
              </div>

            </div>
        }
      </div> {/*inner -container ends here*/}
    </div>
  </div>;

}


export default CollectorHomePage;
