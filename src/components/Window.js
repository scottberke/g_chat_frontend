import React, { Component } from 'react';
import { Chat } from './Chat'
import { UserList } from './UserList'
import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

export class Window extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <ul id="chat-list">
            { this.state.openChats.map((chatId) => <Chat chatId={ chatId }  /> ) }
          </ul>

        </div>

        <UserList newChatHandler={ this.newChatHandler }
                  users={this.state.currentUserList} />
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: '',
      currentUserList: [],
      openChats: []
    };
    this.newChatHandler = this.newChatHandler.bind(this)
    this.addNewChatToOpenChats = this.addNewChatToOpenChats.bind(this)
  }

  returnChatSet() {
    var chatSet = new Set(this.state.openChats)
  }

  newChatHandler(event) {
    event.preventDefault();

    var header = new Headers({
      'Authorization': 'Bearer ' + this.props.accessToken,
      'access_token': this.props.accessToken
    });

    var newUserId = event.target.dataset.userid
    var formData = new FormData();
    formData.append('user_id', newUserId)

    fetch('/api/v1/chats', {
      method: 'POST',
      headers: header,
      body: formData
      })
    .then((response) => response.json())
    .then((response) => this.addNewChatToOpenChats(response))
    .catch( error => this.handleError(error))
  }

  addNewChatToOpenChats(response) {
      var openChatsUnique = this.state.openChats
      openChatsUnique.push(response.id)
      openChatsUnique = [...new Set(openChatsUnique)]

      this.setState({
        openChats: openChatsUnique
      })

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
    var header = new Headers({
      'Authorization': 'Bearer ' + this.props.accessToken,
      'access_token': this.props.accessToken
    });


    fetch('/api/v1/users/index', { method: 'GET',
                                   headers: header
                                 })
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
