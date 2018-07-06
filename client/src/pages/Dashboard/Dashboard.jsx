import React, { Component } from "react";
import Nav from "../../components/Nav";
import CurrentCard from "../../components/CurrentCard";
import API from "../../utils/API";
import cards from "./cards.json";
import games from "./games.json";
import "./Dashboard.css";
import GameRule from "../../components/GameRule";
import KingRule from "../../components/KingRule";

class Dashboard extends Component {

  // ==============
  // Initialization
  // ==============

  state = { 
    cards, 
    games, 
    usedKAs: [], 
    burnedCards: [], 
    currentGame: {}, 
    currentVersion: {},
    currentCard: {}, 
    kingRules: [], 
    rules: [], 
    currentRule: {},
    createdNew: false
  };

  // ===================
  // Life Cycle Methods:
  // ===================

  componentWillMount() {
    if (!localStorage.getItem('username')) {
      const username = window.prompt("Enter your username: (Pretend this is logging in. Hit cancel for no login.")
      this.setState({username})
      localStorage.setItem('username', username);
    } else {
      this.setState({username: localStorage.username})
    }
    
    
  }

  componentDidMount() {
    var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    if (sessionObject) {
      sessionObject.redirectTo = false;
      sessionObject.createdNew = false;
      this.setState(sessionObject);
    }
    
    this.loadGamesFromDB();
    
    
    
    // this.setState({
    //   games: meow
    // })
      // To Do:
      // if (authenticated) setState games to db query result (User.games) 
      // .then query result ({games._id} && {saved: true} [and slice versions array for latest version])
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  // ==============
  // Custom Methods
  // ==============

  loadGame = selectedGame => {

    let rules;

    if (this.state.newAce === true && (this.state.currentGame)) {
      if (window.confirm(`Save current rule changes to ${this.state.currentGame.gameName || selectedGame.gameName}?  \n\n(Note: This will not add a new version. Click 'Save Current as Version' when you are happy with the set of rules.)`)) {
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
      redirectTo: false,
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards || {})),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      // games,
      deckEmpty: false,
      currentGame: selectedGame,
      versions: selectedGame.versions,
      currentVersion: selectedGame.versions[selectedGame.versions.length - 1],
      rules: rules || selectedGame.versions[selectedGame.versions.length - 1].rules,
      kingRules:[],
      usedKAs: [],
      newAce: false
    });
    // setTimeout(() => console.log("loaded game", this.state.currentGame), 2000);
  }

  renderHUD() {
    const {currentCard, currentRule, usedKAs} = this.state;

    if (usedKAs && !(usedKAs.indexOf(currentCard.id) === -1)) {
      return <h1>Rule Changed!</h1>;
    }

    switch(currentCard.rank) {
      case "13":
        return (
          <form>
            <h3>Make a Rule!</h3>
            <small>This will be a global rule for the current game.</small>
            <h6>Enter Name:</h6>
            <input
              type="text"
              placeholder="e.g., 'Wink'"
              name="ruleName"
              value={this.state.ruleName}
              onChange={this.handleInputChange}
            />
            <h6>Enter Instructions:</h6>
            <textarea
              type="text"
              placeholder="e.g., 'If you get winked at during eye contact, you must drink.'"
              name="ruleInstructions"
              value={this.state.ruleInstructions}
              onChange={this.handleInputChange}
            />
            <br />
            <button 
              onClick={this.handleFormSubmit}>Submit
            </button>
          </form>
        )
        break;
      case "1":
        return (
          <form>
          <h3>Chase and Replace!</h3>
          <h6>Pick which card to change (indefinitely!)</h6>
          <select value={this.state.replace} onChange={this.handleSelectChange}>
            <option value="" disabled selected>Choose a rank...</option>
            {
              ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 
              'Eight', 'Nine', 'Ten', 'Jack', 'Queen'].map((word, index) => {
                return <option key={word} value={index + 2}>{word}</option>
              })
            }
          </select>  
          <h6>Enter Rule Name:</h6>
          <input
            type="text"
            placeholder="(rhyming is usually a good idea)"
            name="ruleName"
            value={this.state.ruleName}
            onChange={this.handleInputChange}
          />
          <h6>Enter Instructions:</h6>
          <textarea
            type="text"
            placeholder="Be creative!"
            name="ruleInstructions"
            value={this.state.ruleInstructions}
            onChange={this.handleInputChange}
          /><br/>
          <button 
            onClick={this.handleFormSubmit}>Submit
          </button>
        </form>
        );
      default:
        return (
          <div>
            <h1>{currentRule.name}</h1>
            <h3>{currentRule.instructions}</h3>
          </div>
        );
    }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSelectChange = event => {
    console.log(event.target.value);
    this.setState({"replace": event.target.value});
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const {ruleName, ruleInstructions, currentCard, replace} = this.state;
    if (replace || currentCard.rank === "13") {
      this.setRule(ruleName, ruleInstructions, currentCard.rank, replace);
      this.setState({ ruleName: "", ruleInstructions: "" });
    } else if (currentCard.rank === "1") {
      alert("choose a card rank!");
    }
  };
 
  setRule(name, instructions, rank, replace) {
    console.log(name);
    if (rank == "13") {
      const kings = this.state.kingRules;
      kings.push({
        name,
        instructions,
        image: this.state.currentCard.image
      });
      this.setState({kingRules: kings});
    }
    else if (rank == "1") {
      const oldRules = this.state.rules;
      const newRules = oldRules.filter(rule => rule.rank !== replace);
      newRules.push({
        name, 
        instructions,
        rank: replace
      });
      newRules.sort((a, b) => a.rank - b.rank);
      this.setState({rules: newRules, replace: "", newAce: true})
    }
    const usedKAs = this.state.usedKAs || [];
    usedKAs.push(this.state.currentCard.id);
    this.setState({usedKAs});
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  loadGamesFromDB() {
    
    if (this.state.username) { // IF AUTHENTICATED / SIGNED IN
      console.log("loading games from DB");
      API.getUser({user_name: this.state.username}) // retrieves user obj
        .then(response => {
          if (!response.data[0].seeded) {
            API.getDefaultGames()  // retrieves forkedfrom: original
              .then(res => {
                if (!response.data[0].seeded) {  // if this hasn't been done yet
                  let clones = [];
                  for (let i in res.data) {
                    let clone = res.data[i];
                    clone._id = clone._id + "_" + this.state.username;
                    clone.admin = this.state.username;
                    clone.forkedFrom = this.state.username;
                    clone.created = new Date(Date.now());
                    clones.push(clone);  
                  }
                  API.saveClones({user_name: this.state.username, games: clones})
                    .then(res => {
                      this.setState({games: res.data})
                      API.updateUserAsSeeded({user_name: this.state.username})
                        .then(res => console.log(res.data))
                    }).catch(err => console.log(err));
                } 
                else this.setState({games: res.data})
              }).catch(err => console.log(err));
          }
          else {
            console.log("ass");
            API.getGamesByUser({gameIDs: response.data[0].games})
              .then(resp => {
                console.log(resp.data);
                this.setState({games: resp.data})
              })
              .catch(err => console.log(err));
          }
        }).catch(err => console.log(err));
    }
    else {
      console.log("loading basic games from DB");
      API.getUserGames()
        .then(res => this.setState({games: res.data}))
        .then(console.log(this.state.games))
        .catch(err => console.log(err));
    }

  }

  saveVersion() {
    // local storage
    // db (authenticated)
    if (this.state.newAce || localStorage.getItem(`versionState: ${this.state.currentGame.gameName}`)) {
      const name = window.prompt("Enter a name for this version:");
      if (name) {
        const version = {
          versionName: name,
          date: new Date(Date.now()),
          rules: this.state.rules
        }
        API.pushVersion({gameID: this.state.currentGame._id, version: version})
          .then(res => {
            this.loadGamesFromDB();
            localStorage.removeItem(`versionState: ${this.state.currentGame.gameName}`);
          })
          .then(res => {
            this.setState({
              currentVersion: {versionName: name},
              newAce: false
            });
          })
          .catch(err => console.log(err));
      }
    }
  }

  drawCard() {
    if (this.state.currentGame.gameName && this.state.cards.length > 0) {
      const rules = this.state.rules;
      const card = this.state.cards.pop();
      const newBurn = this.state.burnedCards;
      newBurn.push(card);
      this.setState({
        currentCard: card,
        currentRule: rules[card.rank - 1],
        burnedCards: newBurn,
        deckEmpty: (this.state.cards.length === 0)
      });
    }
  }

  undo() {
    if (this.state.currentGame.gameName && this.state.cards.length < 52) {
      const card = this.state.burnedCards.pop();
      const newCurrentCard = this.state.burnedCards[this.state.burnedCards.length - 1] || {};
      const newCards = this.state.cards;
      newCards.push(card);
      this.setState({
        currentRule: this.state.rules[newCurrentCard.rank - 1] || {},
        currentCard: newCurrentCard,
        cards: newCards,
        deckEmpty: false
      });
    }
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

        <div className="wrapper">
          
          <div className="game-title">
            <strong>{this.state.currentGame.gameName || "Nothing loaded!"}</strong>
            <div>{this.state.currentGame.forkedFrom !== this.state.username ? 
              <div><small>cloned from: </small><a href="/search">{this.state.currentGame.forkedFrom}</a></div> :
              <div><small>by: </small><a href="/edit">{this.state.currentGame.admin}</a></div>}
            </div>
          </div>
          <div className="author">{`Version: ${this.state.currentVersion.versionName || "none!"}\n\n`}</div>
          <div className="version">
          {(this.state.newAce || localStorage.getItem(`versionState: ${this.state.currentGame.gameName}`)) ? 
              <button className="btn btn-secondary" onClick={() => this.saveVersion()}>Save Current as Version</button> : 
              <div>Version Up to Date</div>}
          </div>
          
          
          <div className="decks">
            <img src={this.state.deckEmpty ? "./images/empty.png" : "./images/deck.png"} 
                 className="deck" 
                 onClick={()=>this.drawCard()}/>
          </div>
          
          <div className="current-cards">
            <img alt={this.state.currentCard.rank} 
                 src={this.state.currentCard.image} 
                 onClick={() => this.undo()}
                 className="current-card"/>
          </div>
          
          <div className="king-rules">
            <div className="title">King Rules</div>
            {this.state.kingRules.map(rule=>(
              <KingRule image={rule.image} name={rule.name} instructions={rule.instructions}/>
            ))}
          </div>
          
          <div className="game-rules">
            <div className="title">Game Rules</div>
            {this.state.rules.slice(1).map(rule=>(
              <GameRule rank={rule.rank} name={rule.name} instructions={rule.instructions}/>
            ))}
          </div>
          
          
          <div className="burned-cards">
            {this.state.burnedCards.map(card=>(
              <img alt={card.rank} src={card.image} className="burned-card" />
            ))}
          </div>

          <div className="HUD">
            {this.renderHUD()}
          </div>
          
        </div>

      </React.Fragment>

    );
  }
}

export default Dashboard;
