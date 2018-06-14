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
            { this.state.openChats.map((chat) =>
              <Chat chat={ chat }
                    userId={ this.props.userId }
                    handleClose={this.handleClose}
                    handleSendMessage={this.handleSendMessage}
                    messagesReceived={ this.state.messagesReceived.filter((message) =>
                      message.chat_id == chat.chatId) }
                      />
                  )}
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
      openChats: [],
      messagesReceived: []
    };
    this.newChatHandler = this.newChatHandler.bind(this)
    this.addNewChatToOpenChats = this.addNewChatToOpenChats.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.createSocket = this.createSocket.bind(this)
  }


  newChatHandler(event, username) {
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
    .then((response) => this.addNewChatToOpenChats(response, username))
    .catch( error => this.handleError(error))
  }

  handleClose(event) {
    event.preventDefault();
    var chatIdToClose = Number(event.target.dataset.chatid)
    var updatedOpenChats = this.state.openChats.filter((i) => i.chatId !== chatIdToClose)

    this.setState({
      openChats: updatedOpenChats
    })

  }

  addNewChatToOpenChats(response, username) {
      var openChatsUnique = this.state.openChats
      openChatsUnique.push({ chatId: response.id, username: username } )
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

    var socketUrl = 'ws://localhost:3001/cable?access_token=' + this.props.accessToken
    let cable = Cable.createConsumer(socketUrl)
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected : () => {},
      received: (data) => {
        console.log(data);
        this.handleNewMessage(data)
      },
      create: function(body, chatId) {
        this.perform('create', {
          body: body,
          chat_id: chatId,
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

  handleSendMessage(message, chatId) {
    this.chats.create(message, chatId);
  }

  handleNewMessage(data) {
    var messagesUnique = this.state.messagesReceived
    messagesUnique.push(data)
    messagesUnique = [...new Set(messagesUnique)]

    this.setState({
      messagesReceived: messagesUnique
    })

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
