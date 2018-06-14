import React, { Component } from 'react';

import { ChatInput } from './ChatInput'
import { Message } from './Message'

import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class Chat extends Component {
  render() {
    return (

      <li>
        <div className="panel panel-default" data-chat-id="">
          <div className="panel-heading">
            { this.props.chat.username }
            <a href="" className="toggle-window"></a>
            <a data-chatId={ this.props.chat.chatId }
               href='#'
               className="btn btn-default btn-xs pull-right"
               onClick={(event) => this.props.handleClose(event) }>x</a>
          </div>
          <div className="panel-body">
            <div className="messages-list">
              <ul>
                { this.props.messagesReceived.map((message) =>
                  <Message userId={this.props.userId}
                           newMessage={ message } />
                )}

              </ul>
            </div>
            <ChatInput handleSendMessage={this.handleSendMessage}
                        updateCurrentChatMessage={this.updateCurrentChatMessage}/>
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

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  handleSendMessage(event) {
    event.preventDefault();

    this.props.handleSendMessage(this.state.currentChatMessage, this.props.chat.chatId)

  }
}
