import React, { useEffect } from 'react';

import Button from "react-bootstrap/Button";
// React router dom
import { Link } from 'react-router-dom';
// Stylesheet import
import './Navbar.scss'
const Navbar = (props) => {
    /**
     * If producer object has value -> Its a producer as collector 
     * Give precedence over collector
     * Else, display collector name
     */
    // State to choose default value prop `loggedinuser` or value computed from Collector & Producer logins
    const [computeLoggedIn, setComputedLoggedIn] = React.useState('');
    useEffect(() => {
        if (props.loggedInProducerinfo && props.loggedInProducerinfo && props.loggedInProducerinfo.producerName) {
            if(computeLoggedIn !== props.loggedInProducerinfo.producerName) {
                setComputedLoggedIn(props.loggedInProducerinfo.producerName)
            }
        }
        if (props.loggedInCollectorInfo && props.loggedInCollectorInfo[0] && props.loggedInCollectorInfo[0].collectorName) {
            if(computeLoggedIn !== props.loggedInCollectorInfo[0].collectorName) {
                setComputedLoggedIn(props.loggedInCollectorInfo[0].collectorName)
            }
        }
    }, [props.loggedInCollectorInfo, props.loggedInProducerinfo])
    return <div className="navbar-container">
        <div className="persona-selection">
            <div className="go-back">
                <Button>
                    <Link to="/">Go Back</Link>
                </Button>
            </div>
            <div className="UserProfile">
                {
                    computeLoggedIn !== '' ?
                        <Button>
                            {computeLoggedIn}
                        </Button>
                        :
                        <Button>
                            {props.loggedinuser}
                        </Button>
                }
            </div>
            <div className="logout">
                <Button>
                    <Link to="/">Logout</Link>
                </Button>
            </div>
        </div>
    </div>;
}

export default Navbar;