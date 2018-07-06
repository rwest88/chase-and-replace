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
    rules: newGameTemplate,
    
  };

  componentDidMount() {
    var sessionObject = sessionStorage.getItem('gameState');
    this.setState(JSON.parse(sessionObject));
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
        _id: this.state.gameName + "_" + this.state.username,
        gameName: this.state.gameName,
        admin: this.state.username,
        forkedFrom: this.state.username,
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

  testFormSubmit = event =>{
    event.preventDefault()
    const newVersionRules = [
      {rank: "1"},
      {rank: "2", name: this.state.rule2Name || this.state.rules[1], instructions: this.state.rule2instructions || this.state.rules[1]},
      {rank: "3", name: this.state.rule3Name || this.state.rules[2], instructions: this.state.rule3instructions || this.state.rules[2]},
      {rank: "4", name: this.state.rule4Name || this.state.rules[3], instructions: this.state.rule4instructions || this.state.rules[3]},
      {rank: "5", name: this.state.rule5Name || this.state.rules[4], instructions: this.state.rule5instructions || this.state.rules[4]},
      {rank: "6", name: this.state.rule6Name || this.state.rules[5], instructions: this.state.rule6instructions || this.state.rules[5]},
      {rank: "7", name: this.state.rule7Name || this.state.rules[6], instructions: this.state.rule7instructions || this.state.rules[6]},
      {rank: "8", name: this.state.rule8Name || this.state.rules[7], instructions: this.state.rule8instructions || this.state.rules[7]},
      {rank: "9", name: this.state.rule9Name || this.state.rules[8], instructions: this.state.rule9instructions || this.state.rules[8]},
      {rank: "10", name: this.state.rule10Name || this.state.rules[9], instructions: this.state.rule10instructions || this.state.rules[9]},
      {rank: "11", name: this.state.rule11Name || this.state.rules[10], instructions: this.state.rule11instructions || this.state.rules[10]},
      {rank: "12", name: this.state.rule12Name || this.state.rules[11], instructions: this.state.rule12instructions || this.state.rules[11]},
      {rank: "13"},
    ]
    this.setState({
      rules: newVersionRules,
      rule2Name: "",
      rule3Name: ""
    });
    const newVersion = {
      versionName: this.state.versionName,
      date: new Date(Date.now()),
      rules: newVersionRules
    }
    API.pushVersion({gameID: this.state.currentGame._id, version: newVersion})
      .then(blah => console.log(blah))
      .catch(blah => console.log(blah));
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>;
    }
    return (
      <React.Fragment>
        <Nav games={this.state.games} loadGame={this.loadGame}/>
        <h1>Create Edit Page</h1>
        {/* <form>
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
        <br /> */}
        <form>
          <h6>Current Game</h6>

          <input
            type="text"
            placeholder={"enter version name"}
            name="versionName"
            value={this.state.versionName}
            onChange={this.handleInputChange}
          />

          <br/><br/>
          
          <input
            type="text"
            placeholder={this.state.rules[1].name}
            name="rule2Name"
            value={this.state.rule2Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[1].instructions}
            name="rule2instructions"
            value={this.state.rule2instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[2].name}
            name="rule3Name"
            value={this.state.rule3Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[2].instructions}
            name="rule3instructions"
            value={this.state.rule3instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[3].name}
            name="rule4Name"
            value={this.state.rule4Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[3].instructions}
            name="rule4instructions"
            value={this.state.rule4instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[4].name}
            name="rule5Name"
            value={this.state.rule5Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[4].instructions}
            name="rule5instructions"
            value={this.state.rule5instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[5].name}
            name="rule6Name"
            value={this.state.rule6Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[5].instructions}
            name="rule6instructions"
            value={this.state.rule6instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[6].name}
            name="rule7Name"
            value={this.state.rule7Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[6].instructions}
            name="rule7instructions"
            value={this.state.rule7instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[7].name}
            name="rule8Name"
            value={this.state.rule8Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[7].instructions}
            name="rule8instructions"
            value={this.state.rule8instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[8].name}
            name="rule9Name"
            value={this.state.rule9Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[8].instructions}
            name="rule9instructions"
            value={this.state.rule9instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[9].name}
            name="rule10Name"
            value={this.state.rule10Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[9].instructions}
            name="rule10instructions"
            value={this.state.rule10instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[10].name}
            name="rule11Name"
            value={this.state.rule11Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[10].instructions}
            name="rule11instructions"
            value={this.state.rule11instructions}
            onChange={this.handleInputChange}
          />

          <br/><br/>

          <input
            type="text"
            placeholder={this.state.rules[11].name}
            name="rule12Name"
            value={this.state.rule12Name}
            onChange={this.handleInputChange}
          />

          <input
            type="text"
            placeholder={this.state.rules[11].instructions}
            name="rule12instructions"
            value={this.state.rule12instructions}
            onChange={this.handleInputChange}
          />

          

          

          <button onClick={

            this.testFormSubmit
            }>save</button>
          
        </form>
        

      </React.Fragment>
    );
  }
}

export default CreateEditGame;