import React from 'react';
import './DashBoard.scss'

// React Bootstrap Imports
import {Nav} from "react-bootstrap";

const DashBoard = (props) => {
    return <div className="dashboard-listing">
        {
            (props.navItems || []).map((navItem, index) => {
                return <Nav.Link className="nav-item" key={index}>{navItem}</Nav.Link>
            })
        }
    </div>
}

export default DashBoard;