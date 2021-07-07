import React from 'react';
import { Redirect } from 'react-router-dom';
import Button from "react-bootstrap/Button";

import './DeliveryCheckIn.scss'

const DeliveryCheckIn = (props) => {
    return <div className="checkin-container">
        {
            props.location.state && props.location.state.consumerHubLoginInfo &&
                props.location.state.consumerHubLoginInfo[0]
                ?
                <h1 className="header">Check-in OTP is {props.location.state.consumerHubLoginInfo[0].OTP}</h1>
                :
                <h1>Hub home page: Check - in OTP Temporarily unavailable - Raise a support Request </h1>
        }
        <div>
            <Button>
                <Redirect to="/consumer-hub-home-page" Go Back />
            </Button>
        </div>
    </div>;
}

export default DeliveryCheckIn;