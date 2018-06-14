import React, { Component } from 'react';

import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class ChatInput extends Component {
  render() {
    return (
      <div>
        <input
            // value={ this.state.currentChatMessage }
            onChange={ (event) => this.props.updateCurrentChatMessage(event) }
            type='text'
            placeholder='Enter your message...'
            className='chat-input'/>
          <button className='send'
                  onClick={ (event) => this.props.handleSendMessage(event) }>
            Send
          </button>
      </div>
    );
  }
  
}
