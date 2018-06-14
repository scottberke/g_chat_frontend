import React, { Component } from 'react';

import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class Message extends Component {
  render() {
    return (

      <li>
        <div className="row">
          <div className={ this.setStyleClassForMessage() }>
            { this.props.newMessage.body }
          </div>
        </div>
      </li>
    );

  }

  constructor(props) {
    super(props);
    this.state = {
        currentChatMessage: ''
    };

    this.updateCurrentChatMessage = this.updateCurrentChatMessage.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
  }

  setStyleClassForMessage() {
      return this.props.userId == this.props.newMessage.user_id ? 'sender' : 'recipient'
      // debugger
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  handleSendMessage(event) {
    event.preventDefault();

    this.props.handleSendMessage(this.state.currentChatMessage, this.props.chatId)

  }
}
