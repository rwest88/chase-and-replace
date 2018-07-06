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
    rules: newGameTemplate, // prevent an error upon mapping
    // vers: "(unnamed)",
    // versions: []
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


  handleInputChange = (index) => (event) => {
    const newRules = this.state.newGameRules;
    newRules[index + 1][event.target.name] = event.target.value;
    console.log(this.state.newGameRules);
    this.setState({ newGameRules: newRules });
  };

  handleSelectChange = event => {
    const {value} = event.target;
    const {newGameRules} = this.state;

    // if (this.state.newAce && (this.state.currentGame)) {
    //   if (window.confirm(`Save current rule changes to ${this.state.currentGame.gameName || selectedGame.gameName}?`)) {
    //     localStorage.setItem(`versionState: ${this.state.currentGame.gameName || selectedGame.gameName}`, JSON.stringify(this.state.rules));
    //   }
    // }

    this.setState({
      vers: value,
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
    this.setState({
      rules: this.state.newGameRules,
      redirectTo: "/dashboard"
    });
    const newVersion = {
      versionName: this.state.versionName,
      date: new Date(Date.now()),
      rules: this.state.newGameRules
    }
    API.pushVersion({gameID: this.state.currentGame._id, version: newVersion})
      .then(blah => {
        this.loadGamesFromDB();
        localStorage.removeItem(`versionState: ${this.state.currentGame.gameName}`);
      })
      .catch(blah => {
        this.setState({
          currentVersion: {versionName: this.state.versionName},
          newAce: false
        });
      });
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
          <h6>Pick which version to change</h6>
          <select value={this.state.vers} onChange={this.handleSelectChange}>
            {
              currentGame.versions.map((version, index) => {
                return <option key={version.versionName} value={null}>{version.versionName}</option>
              })
            }
            <option value="this.state.versionName" selected>(current)</option>
            
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
          <h6>{this.state.currentGame}</h6>
          <h6>Pick which version to change</h6>


          {/* <select value={this.state.vers} onChange={this.handleSelectChange}>
            {
              this.state.versions.map((version, index) => {
                return <option key={version.versionName} value={null}>{version.versionName}</option>
              })
            }
            <option value="this.state.versionName" selected>(current)</option>
          </select>   */}



          <input
            type="text"
            placeholder={"enter version name"}
            name="versionName"
            value={this.state.versionName}
            onChange={this.handleInputChange}
          />

          <br/><br/>



          
          {this.state.rules.slice(1,12).map((rule, index) => (

          <div>
          {/* <img className="rule-card" src={`./images/${rule.rank}s.png`} /> */}
          <input
            type="text"
            placeholder={this.state.rules[index + 1].name}
            name="name"
            onChange={this.handleInputChange(index)}
          />

          <input
            type="text"
            placeholder={this.state.rules[index + 1].instructions}
            name="instructions"
            onChange={this.handleInputChange(index)}
          />

          <br/><br/>
          </div>

          ))}

          



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