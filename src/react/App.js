import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Header from './components/header';
import Home from './components/home';
import Login from './components/login';
import SignUp from './components/signUp';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="content">
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
