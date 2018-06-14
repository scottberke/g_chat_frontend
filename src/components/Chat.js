import React, { Component } from 'react';
// import './App.css';
import { ChatInput } from './ChatInput'
import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class Chat extends Component {
  render() {
    return (

      <li>
        <div className="panel panel-default" data-chat-id="">
          <div className="panel-heading">
            { this.props.chatId }
            <a href="" className="toggle-window"></a>
            <a href="" className="btn btn-default btn-xs pull-right"></a>
          </div>
          <div className="panel-body">
            <div className="messages-list">
              <ul>

              </ul>
            </div>
            <ChatInput />
          </div>
        </div>
      </li>
    );

  }


}
