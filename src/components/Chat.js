import React, { Component } from 'react';
// import './App.css';
import { ChatInput } from './ChatInput'
import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class Chat extends Component {
  render() {
    return (
        <div class="col-md-9">
          <ul id="chat-list">
            <li>
              <div class="panel panel-default" data-chat-id="">
                <div class="panel-heading">
                  <a href="" class="toggle-window"></a>
                  <a href="" class="btn btn-default btn-xs pull-right"></a>
                </div>
                <div class="panel-body">
                  <div class="messages-list">
                    <ul>

                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <ChatInput />
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
