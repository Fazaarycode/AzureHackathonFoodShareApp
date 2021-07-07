import './App.scss';
import LandingPage from './components/landing-component/LandingPage.js';
import ProducerLogin from './components/SignIn/ProducerLogin/ProducerLogin.js';
import CollectorLogin from './components/SignIn/CollectorLogin/CollectorLogin.js';
import ConsumerHubLogin from './components/SignIn/ConsumerHubLogin/ConsumerHubLogin.js';
import ProducerHomePage from './components/ProducerHomePage/ProducerHomePage';
import CollectorHomePage from './components/CollectorHomePage/CollectorHomePage';
import ConsumerHubHomePage from './components/ConsumerHubHomePage/ConsumerHubHomePage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
function App() {
  return (
    // fetch('http://localhost:6001/version').then(res => console.log(res))
    <div className="App">
      <div className="inner-app">
          <Router>
            <Switch>
              <Route exact path="/producer-login" component={ProducerLogin} />
              <Route exact path="/collector-login" component={CollectorLogin} />
              <Route exact path="/consumer-hub-login" component={ConsumerHubLogin} />
              <Route exact path="/producer-home-page" component={ProducerHomePage} />
              <Route exact path="/collector-home-page" component={CollectorHomePage} />
              <Route exact path="/consumer-hub-home-page" component={ConsumerHubHomePage} />
              <Route exact path="/" component={LandingPage} />
            </Switch>
          </Router>
      </div>
    </div>
  );
}

export default App;
