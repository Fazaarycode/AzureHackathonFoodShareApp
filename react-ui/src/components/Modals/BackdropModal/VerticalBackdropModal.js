import React, { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

// React local components import
import ScanNearestCollector from './helper/ScanNearestCollector';

// React Router imports
import { Link } from 'react-router-dom';

// Stylesheet import
import './VerticalBackdropModal.scss'

const { useRef } = React;
function MyVerticallyCenteredModal(props) {
  let baseUrl;
  const [otp, setOtp] = React.useState('');
  useEffect(() => {
    baseUrl = process.env.NODE_ENV === 'development' ?
      process.env.REACT_APP_BACKEND_DEV_ENDPOINT_URL :
      process.env.REACT_APP_BACKEND_PRODUCTION_ENDPOINT_URL;
  });
  const scanNearestCollectorToTheProducer = async (e) => {
    let producerData = props.producerinfo;
    const closestCollector =
      await fetch(`${baseUrl}/closestCollectorToProducer?producerId=${props.producerinfo[0].producerId}
      &latitude=${props.producerinfo[0].latitude}&longitude=${props.producerinfo[0].longitude}
    `);
    const dataNearestCollectorToProducer = await closestCollector.json();
    if (dataNearestCollectorToProducer.collectorInfo) {
      alert('A Collector is available to pick up. Waiting for confirmation.....');
      setTimeout(()=> {
        alert('A Collector will arrive in 25minutes');
      }, 10000)
    }
  }

  // verifyOTPWithHub 
  const verifyOTPWithHub = async () => {
    let consumerHubId = props.selectedhubinfo.destPos.hubId;
    // Send out a request
    const verification = await fetch(`${baseUrl}/verifyOTP`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        otp,
        consumerHubId
      })
    })
    const verifyData = await verification.text();
    if(verifyData === 'success')  {
      alert('OTP Verified Successfully! You may now deliver and leave.')
      
    }
    if(verifyData === 'failure') alert('Invalid OTP. Talk to an administrator on the Hub')
  }
  const childRef = useRef(); // Gain access to child component
  return (
    <div className="modal-container">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.modalheading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            props.modaltype === 'otp'
              ?
              <div>
                <div className="form-section">
                  <Form.Group controlId="maxServingCapacity">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control type="text" placeholder="Enter valid OTP to grant access to deliver food"
                      onChange={(e) => setOtp(e.target.value)}
                      value={otp}
                    />
                  </Form.Group>
                </div>
                <div className="hub-name">
                  <h4> Hub Name: {props && props.selectedhubinfo &&
                    props.selectedhubinfo.destPos &&
                    props.selectedhubinfo.destPos.hubName || 'Cannot Retrieve data'}</h4>
                </div>
              </div>
              :
              <div>
                <h4>{props.modalcenteredheading}</h4>
                <p>
                  {
                    props.modaldeliverypreference
                  }
                </p>
              </div>
          }
        </Modal.Body>
        <Modal.Footer>
          {props.modaltype === 'otp'
            ? <Button type="button" onClick={() => verifyOTPWithHub()}
              disabled={!otp}
            >
              Verify OTP
            </Button>
            : <div className="modal-footer-buttons">
              <Button onClick={props.onHide}>Go Back</Button>
              <div className="self-deliver">
                <Button onClick={props.onHide} type="button" variant="primary"
                  disabled={!props || !props.producerinfo || !props.producerinfo[0]}
                >
                  <Link to={{
                    pathname: `/collector-home-page`,
                    query: {
                      producerId: props.producerinfo[0].producerId || '',
                      producerAllInfo: props.producerinfo[0] || '',
                      collectorType: 'producer-as-collector',
                      producerServingsInformation: props.producerservingsinformation
                    }
                  }}>
                    Delivery it myself</Link>
                </Button>
              </div>
              <Button onClick={(e) => scanNearestCollectorToTheProducer()}>Wait for collector</Button>
            </div>}

        </Modal.Footer>
      </Modal>
      <ScanNearestCollector ref={childRef} />
    </div>
  );
}

export default MyVerticallyCenteredModal;