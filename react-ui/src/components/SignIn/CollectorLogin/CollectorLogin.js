import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
    Link, Redirect
} from 'react-router-dom';
import './CollectorLogin.scss';

const CollectorLogin = () => {
    let baseUrl;
    // useEffect(() => {
    baseUrl = process.env.NODE_ENV === 'development' ?
        process.env.REACT_APP_BACKEND_DEV_ENDPOINT_URL :
        process.env.REACT_APP_BACKEND_PRODUCTION_ENDPOINT_URL;
    // });

    const [loginData, setLoginData] = useState([]);
    const [email, setEmail] = useState('first@collector.com');
    const [password, setPassword] = useState('Zm8#7CUn8qjc');
    const [loginAllowed, setLoginAllowed] = useState(false);
    const initiateLoginProcess = async (e) => {
        e.preventDefault();
        // Make a request to Backend - Verify DB and send Response values as Props to Collector homepage component
        const loginInformationResponse = await fetch(`${baseUrl}/collectorLogin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const res = await loginInformationResponse.json();
        if (res) {
            if (res.success == true) {
                setLoginAllowed(true);
                setLoginData([
                    res.loggedInCollectorData.loggedInCollector
                ])
            }
            if(!res.success) {
                setLoginAllowed(false);
                alert('Invalid credentials, try again.')
            }
        }
    }
    return <div className="collector-login-parent-container">
        <div className="left-design"> </div>
        <div className="right-design">
            {

                loginData.length >= 1 && loginAllowed === true ?
                    <Redirect to={{
                        pathname: '/collector-home-page',
                        state: {
                            collectorLoginInfo: loginData
                        }
                    }} />
                    :
                    <div className="collector-login-container">
                        <h1 className="header"> Collector Login </h1>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email"
                                    value={email}
                                    onChange={(e) => setEmail((e.target.value))}
                                    placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
    </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password"
                                    value={password}
                                    onChange={(e) => setPassword((e.target.value))}
                                    placeholder="Password" />
                            </Form.Group>
                            <div className="login-button">
                                <Button variant="primary" type="submit" onClick={initiateLoginProcess}>
                                    {/* <Link to="/Collector-home-page">Login</Link> */}
Login
</Button>
                            </div>
                        </Form>
                        <div className="accessibility-buttons">
                            <div className="go-back-landing-page">
                                <Button variant="secondary" type="button">
                                    <Link to="/">Go Back</Link>
                                </Button>
                            </div>
                            <div className="signup-button">
                                <Button variant="secondary" type="button">
                                    Don't have an account? Sign up instead
    </Button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    </div>;
}

export default CollectorLogin;