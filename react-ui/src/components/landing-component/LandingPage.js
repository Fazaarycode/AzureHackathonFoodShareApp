import React from 'react';
import './LandingPage.scss';
import {
    Link,
} from "react-router-dom";

const LandingPage = () => {
    return <div className="landing-page-container">
            <div className="left-design">
            </div>
            <div className="right-design">
            <h1 className="header-persona"> Choose role... </h1>
            <div className="persona-list">
                <div className="producer-persona">
                    <button>
                        <Link to="/producer-login">Producer</Link>
                    </button>
                </div>
                <div className="collector-persona">
                    <button><Link to="/collector-login">Collector</Link></button>
                </div>
                <div className="consumer-hub-persona">
                    <button><Link to="/consumer-hub-login">Consumer Hub</Link></button>
                </div>
            </div>
            </div>
        </div>
    ;
}

export default LandingPage;