import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Header from './components/header';
import Home from './components/home';
import Login from './components/login';
import SignUp from './components/signUp';
import Settings from './components/settings';
import './App.css';
import AuthService from './services/auth-service';
import Navbar from './components/navbar';
import FourOhFour from './components/fourOhFour';

class App extends Component {

  constructor(props) {
    super(props);
    AuthService.onUserDataChanged = () => this.forceUpdate();
  } 

  render() {
    return (
      <div className="App">
        <Header />
        <div className="content" style={{padding: '64px 0 56px 0'}}>
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/settings" component={Settings} />
            <Route component={FourOhFour} />
          </Switch>
        </div>
        <Navbar/>
      </div>
    );
  }
}

export default App;
