import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
    Link, Redirect
} from 'react-router-dom';
import './ProducerLogin.scss';

// import ProducerHomePage from '../../HomePage/Producer/ProducerHomePage/ProducerHomePage'
const ProducerLogin = (props) => {
    const [loginData, setLoginData] = useState([]);
    const [email, setEmail] = useState('first@producer.com');
    const [password, setPassword] = useState('Z@Qx8FBjg&C1');
    const [loginAllowed, setLoginAllowed] = useState(false);

    let baseUrl;
    // useEffect(() => {
        baseUrl= process.env.NODE_ENV === 'development' ? 
        process.env.REACT_APP_BACKEND_DEV_ENDPOINT_URL: 
        process.env.REACT_APP_BACKEND_PRODUCTION_ENDPOINT_URL;
    // });


    const initiateLoginProcess = async (e) => {
        e.preventDefault();
        // setLoginAllowed(true);
        const loginInformationResponse = await fetch(`${baseUrl}/producerLogin`, {
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
        const res= await loginInformationResponse.json();
        console.log('RES'  ,res)
        if(res) {
            if(res.success == true) {
                setLoginAllowed(true);
                setLoginData([
                    res.loggedInProducerData.loggedInProducer
                ])
            }
            if(!res.success) {
                setLoginAllowed(false);
                alert('Invalid credentials, try again.')
            }
        }
    }

    return <div className="producer-login-parent">
                <div className="producer-left-design"></div>
                <div className="producer-right-design">
                    {
                        loginAllowed === true ?
                            <Redirect to={{
                                pathname: '/producer-home-page',
                                state: {
                                    producerLoginInfo: loginData
                                }
                            }} />
                            :
                            <div className="producer-login-form">
                                <h1 className="header"> Producer Login </h1>
                                <Form onSubmit={initiateLoginProcess}>
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
                                        <Form.Control type="password" placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword((e.target.value))}
                                        />
                                    </Form.Group>
                                    <div className="login-button">
                                        <Button variant="primary" type="submit">
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

export default ProducerLogin;