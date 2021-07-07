import React from 'react';
import Button from "react-bootstrap/Button";
// Import Local components
import Navbar from '../Navbar/Navbar';
// Import React Router
import {
    Link
} from 'react-router-dom';

// Import Stylesheet
import './ConsumerHubHomePage.scss'
const ConsumerHubHomePage = (props) => {
    const [otp, showOtp] = React.useState(false);
    return <div className="consumer-hub-homepage-container">
        <Navbar className="NavBar"
            loggedinuser={props.location.state.consumerHubLoginInfo[0].consumerHubName}
        />
        <div className="hub-container-second">
            {props.location.state && props.location.state.consumerHubLoginInfo
                && props.location.state.consumerHubLoginInfo[0]
                ?
                <h1 className="header"> Welcome {props.location.state.consumerHubLoginInfo[0].consumerHubName}</h1>
                :
                <h1>Hub home page: Check - in OTP Temporarily unavailable - Raise a support Request </h1>
            }
            <div className="buttons-side-panel-flex">
                <div className="hub-activities">
                    <Button variant="primary" type="button"
                    onClick = {() => showOtp(!otp)}
                    >
                        Check-in Delivery
                    </Button>
                    <Button variant="primary" type="button">
                        Recent Deliveries
            </Button>
                    <Button variant="primary" type="button">
                        Add Consumer
            </Button>
                    <Button variant="primary" type="button">
                        Dispatch Food to Consumer
            </Button>

                    <Button variant="primary" type="button">
                        Check Consumer registration
            </Button>
                    <Button variant="primary" type="button">
                        Consumer Hub Internals
            </Button>
                </div>
                <div className="side-panel" 
                style = {{ visibility: otp === true ? "visible": "hidden"}}
                >
                    <h1 className="header-otp">Check-in OTP is {props.location.state.consumerHubLoginInfo[0].OTP}</h1>
                </div>
            </div>
        </div>
    </div>;
}

export default ConsumerHubHomePage;