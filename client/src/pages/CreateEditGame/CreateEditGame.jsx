import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Link } from "react-router-dom";
import "./CreateEditGame.css";

class CreateEditGame extends Component {
  // state = sessionStorage.getItem('gameState');
  // componentWillMount() {
  //   this.setState(sessionStorage.getItem('gameState'))
  // }
  render() {
    return (
      <React.Fragment>
        {/* <Nav games={this.state.games} handleLoadGame={this.state.loadGame}/> */}
        <Nav />
        <h1>Create Edit Page</h1>
      </React.Fragment>
    );
  }
}

export default CreateEditGame;