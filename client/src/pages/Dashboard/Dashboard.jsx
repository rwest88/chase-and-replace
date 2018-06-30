import React, { Component } from "react";
import Nav from "../../components/Nav";
import CurrentCard from "../../components/CurrentCard";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import cards from "./cards.json";
import games from "./games.json";
import "./Dashboard.css";
import GameRule from "../../components/GameRule";
import KingRule from "../../components/KingRule";

class Dashboard extends Component {
  // trying to:
  // save game state across pages in session storage (how many cards have been drawn, etc.)
  // save version state (subset of game state) in local storage (what the rule set is for each game)

  // it seems like the page mounts before the session storage can finish
  // and the data is only moving from dashboard to createpage, and not vice-versa
  // ^^ except for the first time, which is really strange to me

  // redux?  
  //
  // NEVERMIND! I got this to work by repeating this code twice in each page (strangely and not super DRY):
  // 
  //  var sessionObject = sessionStorage.getItem('gameState');
  //  this.setState(JSON.parse(sessionObject));
  // ==========================================================================================

  // ==============
  // Initialization
  // ==============

  state = { cards, games, usedKAs: [], burnedCards: [] };

  // ===================
  // Life Cycle Methods:
  // ===================

  componentWillMount() {
    if (!sessionStorage.getItem('gameState')) {
      console.log('no session data');
      this.loadGame();
    } else {
      console.log('yes session data');
      const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
      sessionObject.redirectTo = false;
      this.setState(sessionObject);
    }
  }

  componentDidMount() {
    var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    if (sessionObject) {
      sessionObject.redirectTo = false;
      this.setState(sessionObject);
      sessionStorage.removeItem('gameState');
    }
      // To Do:
      // if (authenticated) setState games to db query result (User.games) 
      // .then query result ({games._id} && {saved: true} [and slice versions array for latest version])
  }

  componentWillUnmount() {
    // this.setState({redirectTo: false});
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  // ==============
  // Custom Methods
  // ==============

  loadGame = selectedGame => {
    console.log(this.state.burnedCards);
    console.log(this.state.cards);

    let rules;
    if (!selectedGame) {
      selectedGame = games[0]; 
      rules = games[0].rules;
    }
    console.log(this.state.usedKAs.length);
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
      redirectTo: false,
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
      replace: "2", // temporary solution
      
    });
    setTimeout(() => console.log("loaded game", this.state.currentGame), 2000);
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

    // handle any changes to the input fields
  handleInputChange = event => {
    // Pull the name and value properties off of the event.target (the element which triggered the event)
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSelectChange = event => {
    console.log(event.target.value);
    this.setState({"replace": event.target.value});
    setTimeout(() => console.log(this.state.replace), 1000);
  }

  // When the form is submitted, prevent the default event and alert the username and password
  handleFormSubmit = event => {
    event.preventDefault();
    const {ruleName, ruleInstructions, currentCard, replace} = this.state;
    console.log(replace);
    this.setRule(ruleName, ruleInstructions, currentCard.rank, replace);
    this.setState({ ruleName: "", ruleInstructions: "" });
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
      this.setState({rules: newRules})
    }
    const usedKAs = this.state.usedKAs || [];
    usedKAs.push(this.state.currentCard.id);
    this.setState({usedKAs});
  }

  loadGamesFromDB() {
    // if (authenticated)
  }

  saveRules() {
    // local storage
  }

  saveVersion() {
    // local storage
    // db (authenticated)
  }

  drawCard() {
    if (this.state.cards.length > 0) {
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
    if (this.state.cards.length < 52) {
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
          
          {/* <div className="app-title">App Title</div> */}
          <div className="game-title">Game Title<br/>{this.state.currentGame.gameName}</div>
          <div className="author">Author</div>
          <div className="version">Version</div>
          
          <div className="decks">
            <img src={this.state.deckEmpty ? "./images/empty.png" : "./images/deck.png"} 
                 className="deck" 
                 onClick={()=>this.drawCard()}
            />
          </div>
          
          <div className="current-cards">
            {/* <CurrentCard rank={this.state.currentCard.rank} image={this.state.currentCard.image} className="current-card"/> */}
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
