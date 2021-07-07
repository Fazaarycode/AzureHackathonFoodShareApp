import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

// Import signin components
import ProducerLogin from '../components/landing-component/SignIn/ProducerLogin/ProducerLogin.js';
import LandingPage from '../components/landing-component/LandingPage.js';

const routes = [
    {
        path: "/producer-signin",
        component: ProducerLogin
    },
    {
        path: "/",
        component: LandingPage
    },
    // {
    //     path: "/collector-signin",
    //     component: Tacos,
    // },
    // {
    //     path: "/consumer-hub-signin",
    //     component: Tacos,
    // },

    // {
    //     path: "/producer-signup",
    //     component: Sandwiches
    // },
    // {
    //     path: "/collector-signup",
    //     component: Tacos,
    // },
    // {
    //     path: "/consumer-hub-signup",
    //     component: Tacos,
    // },

];