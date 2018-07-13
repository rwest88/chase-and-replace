import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Nav from "../../components/Nav";
// import CurrentCard from "../../components/CurrentCard";
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
    currentGame: false, 
    currentVersion: {},
    currentCard: {}, 
    kingRules: [], 
    rules: [], 
    currentRule: {},
    createdNew: false,
    versions: [],
  };

  // ==================
  // Life Cycle Methods
  // ==================

  componentWillMount() {
    if (!localStorage.getItem('username')) {
      // redirect to landing page, move this block into there.
      const username = window.prompt("Enter your username: (Pretend this is logging in. Hit cancel for no login.")
      if (username) {
        localStorage.setItem('username', username)
        this.setState({username})
      }
    } 
    else this.setState({username: localStorage.username});
  }

  componentDidMount() {
    var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    if (sessionObject) {
      sessionObject.redirectTo = false;
      this.setState(sessionObject);
    }
    this.loadGamesFromDB();
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  // ==============
  // Custom Methods
  // ==============

  loadGame = (selectedGame, selectedVersion) => {
    
    let rules;

    if (this.state.newAce === true && (this.state.currentGame)) {
      if (window.confirm(`Save current rule changes to ${this.state.currentGame.gameName}?  \n\n(Note: This will not add a new version. Click 'Save Current as Version' when you are happy with the set of rules.)`)) {
        localStorage.setItem(`versionState: ${this.state.currentGame.gameName}`, JSON.stringify(this.state.rules));
      }
    }
    
    if (localStorage.getItem(`versionState: ${selectedGame.gameName}`)) {
      if (window.confirm(`Load previous rule changes to ${selectedGame.gameName}?`)) {
        const localObject = JSON.parse(localStorage.getItem(`versionState: ${selectedGame.gameName}`));
        rules = localObject;
      }
    }

    if (selectedVersion === undefined) var selectedVersion = selectedGame.versions.length - 1;

    this.setState({
      redirectTo: false,
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards || {})),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      // games,
      deckEmpty: false,
      currentGame: selectedGame,
      gameName: selectedGame.gameName,
      versions: selectedGame.versions,
      vers: selectedVersion,
      currentVersion: selectedGame.versions[selectedVersion],
      rules: rules || selectedGame.versions[selectedVersion].rules,
      oldRules: rules || selectedGame.versions[selectedVersion].rules,
      kingRules: [],
      usedKAs: [],
      newAce: false,
      clearedFields: false
    });
  }

  renderHUD() {
    const {currentCard, currentRule, usedKAs} = this.state;

    if (usedKAs && !(usedKAs.indexOf(currentCard.id) === -1)) {
      return <h1>Rule Changed!</h1>;
    }

    switch(currentCard.rank) {
      case "13":
        return (
          <form className="current-rule">
            <h1 className="king">Make a Rule!</h1>
            <h3>This will be a global rule for the current game.</h3>
            <br />
            <div>
            <input
              type="text"
              placeholder="Enter name..."
              name="ruleName"
              value={this.state.ruleName}
              onChange={this.handleInputChange}
            />
            </div>
            <div>
            <textarea
              type="text"
              placeholder="Enter instructions..."
              name="ruleInstructions"
              value={this.state.ruleInstructions}
              onChange={this.handleInputChange}
            />
            </div>
            <button 
              onClick={this.handleFormSubmit}>Submit
            </button>
          </form>
        )
      case "1":
        return (
          <form className="current-rule">
          <h1 className="chase-replace">Chase and Replace!</h1>
          <h3 className="change-card">Pick which card to change (indefinitely!)</h3>
          <select value={this.state.replace} onChange={this.handleSelectChange}>
            <option value="" disabled selected>Choose a rank...</option>
            {
              ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 
              'Eight', 'Nine', 'Ten', 'Jack', 'Queen'].map((word, index) => {
                return <option key={word} value={index + 2}>{word}</option>
              })
            }
          </select>  
          <div>
          <input
            type="text"
            placeholder="Enter name..."
            name="ruleName"
            value={this.state.ruleName}
            onChange={this.handleInputChange}
          />
          </div>
          <div>
          <textarea
            type="text"
            placeholder="Enter instructions..."
            name="ruleInstructions"
            value={this.state.ruleInstructions}
            onChange={this.handleInputChange}
          />
          </div>
          <button 
            onClick={this.handleFormSubmit}>Submit
          </button>
        </form>
        );
      default:
        return (
          <div className="current-rule">
            <h1 className="current-rule">{currentRule.name}</h1>
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
      this.setState({rules: newRules, replace: "", newAce: true, oldRules: newRules});
    }
    const usedKAs = this.state.usedKAs || [];
    usedKAs.push(this.state.currentCard.id);
    this.setState({usedKAs});
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  loadGamesFromDB() {
    
    if (this.state.username) { // IF AUTHENTICATED / SIGNED IN
      console.log("loading games from DB");
      API.getUser(this.state.username) // retrieves user obj
        .then(userRes => {
          if (userRes.data.length > 0) {
            console.log("user exists");
            if (!userRes.data[0].seeded) {
              console.log("seeding user");
              API.getDefaultGames()  // retrieves admin: Chase_Replacenson
                .then(res => {
                  // if (!userRes.data[0].seeded) {  // if this hasn't been done yet
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
                    .then(clonesRes => {
                      API.updateUserAsSeeded({user_name: this.state.username})
                        .then(res => {
                          this.setState({games: clonesRes.data}, () => {
                            if (!this.state.currentGame) {
                              console.log("gonna load");
                              this.loadGame(clonesRes.data[0]);
                            }
                          })
                        })
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }
            else {     // if already seeded // need to grab created games
              console.log("already seeded");
              API.getGamesByUser({gameIDs: userRes.data[0].games})
                .then(res => {
                  console.log(res.data);
                  this.setState({games: res.data}, () => {
                    if (!this.state.currentGame) {
                      console.log("gonna load");
                      this.loadGame(res.data[0]);
                    }
                  });
                })
                .catch(err => console.log(err));
            }
          }
          else {
            console.log("creating user");
            API.createUser({
              userName: this.state.username,
              email: this.state.username + "@aol.com", // fake
              password: "password",
              seeded: false,
              games: []
            }).then(res => this.loadGamesFromDB())
            .catch(err => console.log(err));
          }
        }).catch(err => console.log(err));
    }
    else {
      console.log("loading basic games from DB");
      API.getDefaultGames()
        .then(res => this.setState({games: res.data}, () => {
          this.loadGame(games[0]);
        }))
        .catch(err => console.log(err));
    }

    setTimeout(()=>console.log(this.state.currentGame), 5000);

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
            localStorage.removeItem(`versionState: ${this.state.currentGame.gameName}`);
            API.getGame(this.state.currentGame._id).then(res => this.setState({
              versions: res.data.versions, 
              currentVersion: res.data.versions[res.data.versions.length - 1],
              oldRules: res.data.versions[res.data.versions.length - 1].rules,
              newAce: false}, () => {
                this.loadGamesFromDB();
              }))
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

  searchUser(searchTerm) {
    this.setState({searchTerm, redirectTo: "/search"})
  }

  // ================
  // Render Dashboard
  // ================

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>;
    }
    return (
      <React.Fragment>
        
        <Nav games={this.state.games} loadGame={this.loadGame}/>

        <div className="wrapper">
          
          <div className="background">
            <div className="background-image">
              <div className="background-tile">
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" /> 
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" /> 
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" /> 
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" />
              <img alt="stone" src="./images/stone.png" /> 
              </div>
            </div>
          </div>

          <div className="game-title">
            <div className={this.state.burnedCards.length ? "banner raised" : "banner"}>
              <img alt="banner" src={this.state.burnedCards.length ? "./images/regal6.png" : "./images/regal5.png"} />
            </div>
            <strong className={this.state.burnedCards.length ? "game-name raised" : "game-name"}>{this.state.currentGame.gameName || ""}</strong>
          </div>
          

          {/* <div>{this.state.currentGame.forkedFrom !== this.state.username ? 
              <div>
                <small>forked from: </small>
                <button className="btn user" onClick={() => this.searchUser(this.state.currentGame.forkedFrom)}>
                  {this.state.currentGame.forkedFrom}
                </button>
              </div> :
              <div>
                <small>by: </small>
                <button className="btn user" onClick={() => this.searchUser(this.state.currentGame.admin)}>
                  {this.state.currentGame.admin}
                </button>
              </div>
            }</div> */}


          <div className="author">{`Version: ${this.state.currentVersion.versionName || "none!"}\n\n`}</div>
          <div className="version">
          {(this.state.newAce || localStorage.getItem(`versionState: ${this.state.currentGame.gameName}`)) ? 
              <button className="btn btn-secondary" onClick={() => this.saveVersion()}>Save Current as Version</button> : 
              <div>Version Up to Date</div>}
          </div>
          
          
          <div className="decks">
            <img src={this.state.deckEmpty ? "./images/empty.png" : "./images/deck.png"} 
                 className="deck" 
                 onClick={() => this.drawCard()}/>
          </div>
          
          <div className="current-cards">
            <img alt={this.state.currentCard.rank} 
                 src={this.state.currentCard.image} 
                 onClick={() => this.undo()}
                 className="current-card"/>
          </div>
          
          <div className="king-rules">
            <div className="scroll king">
              <img alt="scroll" src="./images/scroll.png" />
            </div>
            <div className="color king"></div>
            <div className="title">King Rules</div>
            {this.state.kingRules.map(rule=>(
              <KingRule image={rule.image} name={rule.name} instructions={rule.instructions}/>
            ))}
          </div>
          
          <div className="game-rules">
            <div className="scroll game">
              <img alt="scroll" src="./images/scroll.png" />
            </div>
            <div className="color game"></div>
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
          
          <div className="table">
            <img alt="table" src="./images/table3.png" />
            <img className="stein" alt="stein" src="./images/stein.png" />
          </div>
          
          <div className="HUD">
            <div className={this.state.burnedCards.length ? 
              (this.state.currentCard.rank == 1) ? "banner-turned faded" : "banner-turned" 
              : "hide"}>
              <img alt="banner" src="./images/regal6.png" />
            </div>
            {this.renderHUD()}
          </div>
          
        </div>

      </React.Fragment>

    );
  }
}

export default Dashboard;
