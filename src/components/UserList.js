import React, { Component } from 'react';
import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class UserList extends Component {
  render() {
    return (
        <div className="col-md-3">
          <div className="panel panel-default">

            <h3 className="panel-heading"> User List </h3>

            <div className="panel-body">
              <ul>
                { this.props.users.map((user) =>
                  <li>
                    <a data-userid={user.id} href='#' onClick={ (event) => this.props.newChatHandler(event) }>
                      {user.username}
                    </a>
                  </li>) }
              </ul>
            </div>

          </div>
        </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleNewChat(event) {
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


}
