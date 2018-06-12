import React, { Component } from 'react';
import { Window } from './components/Window'
import './App.css';
import Cable from 'actioncable';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';


class App extends Component {
  render() {
    return (
      <Window />
    );
  }
}

export default App;
