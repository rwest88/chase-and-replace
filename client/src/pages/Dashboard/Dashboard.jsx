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
        kingRules: [{name:"blah", instructions:"foo", image:"bar"},{name:"blah", instructions:"foo", image:"bar"},{name:"blah", instructions:"foo", image:"bar"},{name:"blah", instructions:"foo", image:"bar"}],
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
 
  sendRule(name) {
    const blah = this.state.kingRules;
    blah.push({"name": name});
    this.setState({kingRules: blah});
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
            {this.state.rules.map(rule=>(
              <GameRule rank={rule.rank} name={rule.name} instructions={rule.instructions}/>
            ))}
          </div>
          
          
          <div className="burned-cards">
            {this.state.burnedCards.map(card=>(
              <img alt={card.rank} src={card.image} className="burned-card" />
            ))}
          </div>

          <div className="HUD">
            <HUD sendRule={() => this.sendRule()}/>
          </div>
          
        </div>

      </React.Fragment>

    );
  }
}

export default Dashboard;
