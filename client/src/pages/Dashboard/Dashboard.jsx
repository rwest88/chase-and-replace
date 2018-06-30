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
import HUD from "../../components/HUD";

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

  // ===================
  // Life Cycle Methods:
  // ===================

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
        // redirectTo: false
      });
    } else {
      console.log('yes session data');
      // this.setState({redirectTo: false});
      // sessionStorage.removeItem('gameState');
      var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
      // // sessionObject.redirectTo = false;
      this.setState(sessionObject);
    }
      
    // var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    // // sessionObject.redirectTo = false;
    // this.setState(sessionObject);
  }

  componentDidMount() {
    var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    if (sessionObject) {
      sessionObject.redirectTo = false;
      this.setState(sessionObject);
      sessionStorage.removeItem('gameState');
    }


    this.shuffleArray(cards);
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

  loadGame = game => {
    // sessionStorage.removeItem('gameState');
    console.log("loaded game");
    this.setState({
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards)),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      deckEmpty: false,
      currentGame: game,
      rules: game.versions[0].rules,
      kingRules:[]
    });
  }

  renderHUD() {
    
    switch(this.state.currentCard.rank) {
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "10":
      case "11":
      case "12":
        return (
         
          <div>
            <h1>{this.state.currentRule.name}</h1>
            <h3>{this.state.currentRule.instructions}</h3>
          </div>
        );
      case "13":
        return (
          <form>
          <p>Enter Rule Name:</p>
          <input
            type="text"
            placeholder="name"
            name="ruleName"
            value={this.state.ruleName}
            onChange={this.handleInputChange}
          />
          <p>Enter Instructions:</p>
          <textarea
            type="text"
            placeholder="instructions"
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
          <p>Select Card to Replace</p>
          <select value={this.state.replace} onChange={this.handleSelectChange}>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
            <option value="5">Five</option>
            <option value="6">Six</option>
            <option value="7">Seven</option>
            <option value="8">Eight</option>
            <option value="9">Nine</option>
            <option value="10">Ten</option>
            <option value="11">Jack</option>
            <option value="12">Queen</option>
        </select>  
          <p>Enter Rule Name:</p>
          <input
            type="text"
            placeholder="name"
            name="ruleName"
            value={this.state.ruleName}
            onChange={this.handleInputChange}
          />
          <p>Enter Instructions:</p>
          <textarea
            type="text"
            placeholder="intsructions"
            name="ruleInstructions"
            value={this.state.ruleInstructions}
            onChange={this.handleInputChange}
          /><br/>
          <button 
            onClick={this.handleFormSubmit}>Submit
          </button>
        </form>
        );
    }
  }

    // handle any changes to the input fields
    handleInputChange = event => {
      // Pull the name and value properties off of the event.target (the element which triggered the event)
      const { name, value } = event.target;
  
      // Set the state for the appropriate input field
      this.setState({
        [name]: value
      });
    };

    handleSelectChange = event => {
      this.setState({"replace": event.target.value})
    }
  
    // When the form is submitted, prevent the default event and alert the username and password
    handleFormSubmit = event => {
      event.preventDefault();
      this.setRule(this.state.ruleName, this.state.ruleInstructions, this.state.currentCard.rank, this.state.replace);
      this.setState({ ruleName: "", ruleInstructions: "" });
    };
 
  setRule(name, instructions, rank, replace) {
    if (rank == "13") {
      const kings = this.state.kingRules;
      kings.push({
        name,
        instructions,
        image: this.state.currentCard.image
      });
      this.setState({kingRules: kings}); // update later for any rank
    }
    else if (rank == "1") {
      console.log(replace);
      const newRules = this.state.rules.filter(rule => rule.rank !== replace);
      newRules.push({
        rank: replace, 
        name, 
        instructions
      });
      newRules.sort((a, b) => a.rank - b.rank);
      // push newRule into newRules
      this.setState({rules: newRules})
    }

  }

  loadGamesFromDB() {
    // if (authenticated)
  }

  saveRule() {
    // local storage
  }

  saveVersion() {
    // local storage
    // db (authenticated)
  }

  drawCard() {
    if (this.state.cards.length === 1) {
      this.setState({deckEmpty: true});
    }
    if (this.state.cards.length > 0) {
      const card = this.state.cards.pop();
      const newBurn = this.state.burnedCards;
      newBurn.push(card);
      
      this.setState({
        currentCard: card,
        currentRule: this.state.rules[card.rank - 1],
        burnedCards: newBurn
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
        currentRule: this.state.rules[this.state.currentCard.rank - 2],
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
