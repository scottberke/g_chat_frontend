import React, { Component } from 'react';

import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class ChatInput extends Component {
  render() {
    return (
      <div>
        <input
            value={ this.state.currentChatMessage }
            onChange={ (e) => this.updateCurrentChatMessage(e) }
            type='text'
            placeholder='Enter your message...'
            className='chat-input'/>
          <button className='send'
                  onClick={ (e) => this.handleSendEvent(e) }>
            Send
          </button>
        </div>  
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: '',
      currentUserList: []
    };
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://localhost:3001/cable')
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected : () => {},
      received: (data) => {
        console.log(data);
      },
      create: function(chatContent) {
        this.perform('create', {
          content: chatContent
        });
      }
    })
  }

  componentWillMount() {
    this.createSocket();
    this.handleComponentsLoaded();
  }

  handleSendEvent(event) {
    event.preventDefault();
    this.chats.create(this.state.currentChatMessage);
    this.setState({
      currentChatMessage: ''
    });
  }

  fetchUsersFromApi() {
    this.setState({ currentUserList: [] })
    fetch('/api/v1/users/index', { method: 'GET' })
    .then((response) => response.json())
    .then((response) => this.setState({ currentUserList: response }))


    // const users = this.state.currentUserList;
  }


  listUsers() {
    if (this.state.currentUserList.length) {
      return this.state.currentUserList.map((user) =>
        <li>{ user.email }</li>
      );
    } else {
      ""
    }
  }



  handleComponentsLoaded() {
    this.fetchUsersFromApi();
    this.listUsers();
  }
}
