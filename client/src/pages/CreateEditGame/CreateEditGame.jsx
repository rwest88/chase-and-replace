import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Redirect } from "react-router-dom";
import "./CreateEditGame.css";
import cards from "../Dashboard/cards.json";
import games from "../Dashboard/games.json";
import newGameTemplate from "../Dashboard/newGameTemplate.json";
import API from "../../utils/API";

class CreateEditGame extends Component {

  state = { 
    cards,
    games,
    newGameRules: newGameTemplate,
    usedKAs: [],
    createdNew: false,
  };

  componentDidMount() {
    var sessionObject = sessionStorage.getItem('gameState');
    this.setState(JSON.parse(sessionObject));
    API.getUserGames()
      .then(res => this.setState({games: res.data, initialized: true}))
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  loadGame = selectedGame => {

    let rules;

    if (!selectedGame) {
      selectedGame = games[0]; 
      rules = games[0].rules;
    }

    if (this.state.usedKAs.length > 0 && (this.state.currentGame)) {
      if (window.confirm(`Save current rule changes to ${this.state.currentGame.gameName || selectedGame.gameName}?`)) {
        localStorage.setItem(`versionState: ${this.state.currentGame.gameName || selectedGame.gameName}`, JSON.stringify(this.state.rules));
      }
    }
    
    if (localStorage.getItem(`versionState: ${selectedGame.gameName}`)) {
      if (window.confirm(`Load previous rule changes to ${selectedGame.gameName}?`)) {
        const localObject = JSON.parse(localStorage.getItem(`versionState: ${selectedGame.gameName}`));
        rules = localObject;
      }
    }

    this.setState({
      redirectTo: "/dashboard",
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards || {})),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      games,
      deckEmpty: false,
      currentGame: selectedGame,
      rules: rules || selectedGame.versions[0].rules,
      kingRules:[],
      usedKAs: [],
      replace: ""
    });
  }

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////


  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSelectChange = event => {
    const {value} = event.target;
    const {newGameRules} = this.state;
    this.setState({
      replace: value,
      ruleName: newGameRules[value - 1].name,
      ruleInstructions: newGameRules[value - 1].instructions
    });
  }

  setRule = event => {
    event.preventDefault()
    const oldRules = this.state.newGameRules;
    const newRules = oldRules.filter(rule => rule.rank !== this.state.replace);
    newRules.push({
      rank: this.state.replace,
      name: this.state.ruleName,
      instructions: this.state.ruleInstructions
    });
    newRules.sort((a, b) => a.rank - b.rank);
    this.setState({
      newGameRules: newRules
    });
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const {newGameRules} = this.state;
    const errors = [];
    for (let i = 1; i < newGameRules.length - 1; i++) {
      if (!newGameRules[i].name) errors.push(`${newGameRules[i].rank}: name`);
      if (!newGameRules[i].instructions) errors.push(`${newGameRules[i].rank}: instructions`);
    }
    if (errors.length > 0) alert("Missing fields: \n" + errors.join("\n"));
    else {
      API.saveNewGame({
        gameName: this.state.gameName,
        admin: "rwest88",
        forkedFrom: "Original",
        created: new Date(Date.now()),
        ratings: [],
        saved: true,
        public: false,
        versions: [
          {
            versionName: "init",
            date: new Date(Date.now()),
            rules: newGameRules
          }
        ]
      });
      this.setState({
        createdNew: true, 
        newGameRules: newGameTemplate, 
        replace: "",
        ruleName: "",
        ruleInstructions: "",
      });
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>;
    }
    return (
      <React.Fragment>
        <Nav games={this.state.games} loadGame={this.loadGame}/>
        <h1>Create Edit Page</h1>
        <form>
          <h3>{this.state.createdNew ? "SAVED!" : "New Game"}</h3>
          <h6>Enter Game Name:</h6>
          <input
            type="text"
            placeholder={"enter something"}
            name="gameName"
            value={this.state.gameName}
            onChange={this.handleInputChange}
          />
          <h6>Pick which card to change (and click Save Rule)</h6>
          <select value={this.state.replace} onChange={this.handleSelectChange}>
            <option value="" disabled selected>Choose a card rank...</option>
            {
              ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 
              'Eight', 'Nine', 'Ten', 'Jack', 'Queen'].map((word, index) => {
                return <option key={word} value={parseInt(index + 2)}>{word}</option>
              })
            }
          </select>  
          <h6>Enter Rule Name:</h6>
          <input
            type="text"
            placeholder={"enter something"}
            name="ruleName"
            value={this.state.ruleName}
            onChange={this.handleInputChange}
          />
          <h6>Enter Instructions:</h6>
          <textarea
            type="text"
            placeholder={"enter something"}
            name="ruleInstructions"
            value={this.state.ruleInstructions}
            onChange={this.handleInputChange}
          /><br/>
          <button 
            onClick={this.setRule}>Save Rule
          </button>
          <button 
            onClick={this.handleFormSubmit}>Create Game
          </button>
        </form>
        <br />
        <br />
{/*         
        <h1>Create Edit Page</h1>
        <form>
          <h3>New Game</h3>
          <h6>Pick which card to change (and click Save Rule)</h6>
          <select value={this.state.replace} onChange={this.handleSelectChange}>
            <option value="" disabled selected>Choose a card rank...</option>
            {
              ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 
              'Eight', 'Nine', 'Ten', 'Jack', 'Queen'].map((word, index) => {
                return <option key={word} value={parseInt(index + 2)}>{word}</option>
              })
            }
          </select>  
          <h6>Enter Rule Name:</h6>
          <input
            type="text"
            placeholder={"enter something"}
            name="ruleName"
            value={this.state.ruleName}
            onChange={this.handleInputChange}
          />
          <h6>Enter Instructions:</h6>
          <textarea
            type="text"
            placeholder={"enter something"}
            name="ruleInstructions"
            value={this.state.ruleInstructions}
            onChange={this.handleInputChange}
          /><br/>
          <button 
            onClick={this.setRule}>Save Rule
          </button>
          <button 
            onClick={this.handleFormSubmit}>Create Game
          </button>
        </form>
        <br />
        <br /> */}
      </React.Fragment>
    );
  }
}

export default CreateEditGame;