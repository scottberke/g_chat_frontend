import React, { Component } from 'react';
import { Window } from './components/Window'
import { Login } from './components/Login'
import './App.css';
import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      access_token: ''
    };
  }

  render() {

    if (this.state.isLoggedIn) {
      return (
        <Window accessToken={ this.state.access_token } />
      );
    } else {
      return (
        <div>
        { this.renderLogin() }
        </div>
      );
    }

  }

  renderLogin() {
    var response = ''
    return <Login handleLogin={ (response) => this.handleLogin(response) } />;
  }

  handleLogin(response) {
      if (response.access_token) {
        this.setState({
          access_token: response.access_token,
          isLoggedIn: true
        });
      } else {
        this.renderLogin
      }
  }
}

export default App;
