import React, { Component } from 'react';
import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLogin: true
    };
  }

  render() {
    return (
      <div id="login" className="row">
        <div id="failed_login" className="alert alert-danger" role="alert" hidden>
          Login failed
        </div>
        <div id="signup" hidden>
          <h2> Sign Up </h2>
        </div>

        <form>
          <div className="form-group">
            <label for="exampleInputEmail1">Username</label>
            <input type="username"
              className="form-control"
              value={ this.state.username }
              onChange={ (event) => this.updateUsername(event) }
              id="username"
              placeholder="Enter username"/>
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password"
              className="form-control"
              value={ this.state.password }
              onChange={ (event) => this.updatePassword(event) }
              id="exampleInputPassword1"
              placeholder="Password"/>
          </div>
          <button className="btn btn-primary send"
                  onClick={ (event) => this.loginOrSignup(event) }>
            Send
          </button>
        </form>
        <div>
          No Username? <a href='#' onClick={ (event) => this.renderSignup(event) }> Get Yo Self One!</a>


        </div>
      </div>


    );
  }


  loginOrSignup(event) {
    if (this.state.isLogin) {
      this.getToken(event)
    } else {
      this.handleSignup(event)
    }
  }

  getToken(event) {
    // fetch('/oauth/token', { method: 'GET' })
    event.preventDefault();
    const username = this.state.username
    const password = this.state.password
    var formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)
    formData.append('grant_type', 'password')
    fetch('/oauth/token', {
      method: 'POST',
      body: formData
      })
    .then((response) => this.checkForLoginError(response))
    .then((response) => response.json())
    .then((response) => this.props.handleLogin(response))
    .catch( error => this.handleError(error))

  }


  checkForLoginError(response) {
    if (!response.ok) {
      throw new Error('Failed Login');
    }
    return response
  }

  handleError(response) {
    var failedLoginWarning = document.getElementById("failed_login")
    failedLoginWarning.hidden = false
  }

  renderSignup(event) {
    var signupHeader = document.getElementById("signup")
    signupHeader.hidden = false

    this.setState({
      isLogin: false
    });
  }

  handleSignup(event) {
    event.preventDefault();
    const username = this.state.username
    const password = this.state.password
    var formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)

    fetch('/api/v1/users', {
      method: 'POST',
      body: formData
      })
    .then((response) => this.checkForSignupError(response))
    .then((response) => response.json())
    .then((response) => this.getToken(event))
    .then((response) => this.props.handleLogin(response))
    .catch( error => this.handleError(error))

  }

  checkForSignupError(response) {
    if (!response.ok) {
      throw new Error('Failed Login');
    }

    return response
  }

  updatePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  updateUsername(event) {
    this.setState({
      username: event.target.value
    });
  }


}
