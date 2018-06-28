import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Link } from "react-router-dom";
import "./CreateEditGame.css";
import cards from "../Dashboard/cards.json";
import games from "../Dashboard/games.json";

class CreateEditGame extends Component {

  componentWillMount() {
    if (!sessionStorage.getItem('gameState')) {
      console.log('no session data');
      this.setState({
        cards,
        burnedCards: [],
        currentCard: {},
        currentRule: {},
        games,
        currentGame: games[0],
        rules: games[0].versions[0].rules,
        kingRules: []
      });
    } else {
      console.log('yes session data');
    }
    var sessionObject = sessionStorage.getItem('gameState');
    this.setState(JSON.parse(sessionObject));
  }

  componentDidMount() {
    var sessionObject = sessionStorage.getItem('gameState');
    this.setState(JSON.parse(sessionObject));
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  loadGame = game => {
    sessionStorage.removeItem('gameState');
    console.log(game);
    this.setState({
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards)),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      deckEmpty: false,
      currentGame: game,
      rules: game.versions[0].rules
    });
  }

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  render() {
    return (
      <React.Fragment>
        <Nav games={this.state.games} loadGame={this.loadGame}/>
        <h1>Create Edit Page</h1>
      </React.Fragment>
    );
  }
}

export default CreateEditGame;