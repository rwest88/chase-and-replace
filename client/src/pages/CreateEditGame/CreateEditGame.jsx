import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Link } from "react-router-dom";
import "./CreateEditGame.css";

class CreateEditGame extends Component {
  render() {
    return (
      <React.Fragment>
        <Nav />
        <h1>Create Edit Page</h1>
      </React.Fragment>
    );
  }
}

export default CreateEditGame;