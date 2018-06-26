import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Link } from "react-router-dom";
import "./SearchGames.css";

class SearchGames extends Component {
  render() {
    return (
      <React.Fragment>
        <Nav />
        <h1>Search Games Page</h1>
      </React.Fragment>
    );
  }
}

export default SearchGames;