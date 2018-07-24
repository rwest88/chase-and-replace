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

    let {games} = this.state;
    let rules;
    
    // if (selectedGame === undefined) selectedGame = games[0];

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

    if (selectedGame.gameName === "[Random Mix!]") {
      games = games.filter(game => game.gameName !== "[Random Mix!]");
      games = this.addRandom(games);
    }

    if (selectedVersion === undefined) var selectedVersion = selectedGame.versions.length - 1;

    this.setState({
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards || {})),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      games,
      deckEmpty: false,
      currentGame: selectedGame,
      lookingAt: selectedGame,
      gameName: selectedGame.gameName,
      versions: selectedGame.versions,
      versionIndex: selectedVersion,
      currentVersion: selectedGame.versions[selectedVersion],
      rules: rules || selectedGame.versions[selectedVersion].rules,
      oldRules: rules || selectedGame.versions[selectedVersion].rules,
      kingRules: [],
      usedKAs: [],
      newAce: false
    });
  }

  renderIntro() {
    return (
      <div>
        <h4 className="welcome">Welcome to Chase and Replace!</h4>
        <br />
        <p>Chase and Replace is a variation on the drinking game, <a href="https://en.wikipedia.org/wiki/Kings_(game)" target="_blank">Kings</a>.</p>
        <p>Players take turns drawing cards and following instructions, however:</p>
        <ul className="intro-list">
          <li>The Ace is Special</li>
          <li>The player drawing an Ace <em>changes a rule</em> for any card, Two through Queen</li>
          <li>...Permanently!</li>
          <li>Because of this, the game <em>evolves</em> the more it is played</li>
          <li>As rules change, version history is saved (for premium users)</li>
          <li>Premium users can create themed games and share them online!</li>
        </ul>

        <p>You will see instructions for each card in this window.</p>
      </div>
    )
  }

  renderHUD() {
    const {currentCard, currentRule, usedKAs} = this.state;

    if (usedKAs && !(usedKAs.indexOf(currentCard.id) === -1)) {
      return (
        <div className="current-rule">
          <h1 className="king">Rule Changed!</h1>
        </div>
      );
    }

    switch(currentCard.rank) {
      case "13":
        return (
          <form className="current-rule">
            <h1 className="king">Make a Rule!</h1>
            <h3 className="global-rule">This will be a global rule for the current game.
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
            </h3>
          </form>
        );
      case "1":
        return (
          <form className="current-rule">
            <h1 className="chase-replace">Chase and Replace!</h1>
            <h3 className="change-card">Everyone Drinks!<br />Choose a card to change (permanently!)
            <br />
            <select 
              className="ace-form-items"
              value={this.state.replace} 
              onChange={this.handleSelectChange}
            >
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
              className="ace-form-items"
              type="text"
              placeholder="Enter name..."
              name="ruleName"
              value={this.state.ruleName}
              onChange={this.handleInputChange}
            />
            </div>
            <div>
            <textarea
              className="ace-form-items"
              type="text"
              placeholder="Enter instructions..."
              name="ruleInstructions"
              value={this.state.ruleInstructions}
              onChange={this.handleInputChange}
            />
            </div>
            <button 
              className="ace-form-items"
              onClick={this.handleFormSubmit}>Submit
            </button>
            </h3>
          </form>
        );
      case null, undefined: // player hasn't started game
        return (
          <div className="current-rule">
            <h3 className="intro">{this.renderIntro()}</h3>
          </div>
        );
      default:
        return (
          <div className="current-rule">
            <h1 className="current-rule">{currentRule.name || "No name given!"}</h1>
            <h3 className={
              (currentRule.instructions.length > 140) ?
                (currentRule.instructions.length > 250) ?
                  "over-250" :
                "over-140" :
              ""
            }>
              {currentRule.instructions || "No instructions given!"}
            </h3>
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
    } else if (currentCard.rank === "1") {
      alert("choose a card rank!");
    }
  };
 
  setRule(name, instructions, rank, replace) {
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
      if (!name) return window.alert("You must at least enter a name!");
      const oldRules = this.state.rules;
      const newRules = oldRules.filter(rule => rule.rank !== replace);
      newRules.push({
        name: name || "",
        instructions: instructions || "",
        rank: replace
      });
      newRules.sort((a, b) => a.rank - b.rank);
      this.setState({rules: newRules, replace: "", newAce: true, oldRules: newRules});
    }
    const usedKAs = this.state.usedKAs || [];
    usedKAs.push(this.state.currentCard.id);
    this.setState({usedKAs, ruleName: "", ruleInstructions: ""}, () => {
      sessionStorage.setItem('gameState', JSON.stringify(this.state));
    });
  }

  loadGamesFromDB() {
    
    if (this.state.username) { // IF AUTHENTICATED / SIGNED IN
      console.log("loading games from DB");
      API.getUser(this.state.username) // retrieves user obj
        .then(userRes => {
          console.log(userRes);
          if (userRes.data.length > 0) {
            console.log("user exists");
            if (!userRes.data[0].seeded) {
              console.log("seeding user");
              API.getDefaultGames("Chase_Replacenson")  // retrieves admin: Chase_Replacenson
                .then(res => {
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
                              this.loadGamesFromDB();
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
                  const games = this.addRandom(res.data)
                  this.setState({games}, () => {
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

  addRandom = games => {
    if (this.state.username && games.length > 1) {
      const recentRules = [{rank: "1"}];
      const allRules = [{rank: "1"}];
      for (var i = 0; i < 11; i++) {
        let randIdx = Math.floor(Math.random() * games.length);
        recentRules.push(games[randIdx].versions[games[randIdx].versions.length - 1].rules[i + 1]);
        allRules.push(games[randIdx].versions[Math.floor(Math.random() * games[randIdx].versions.length)].rules[i + 1]);
      }
      recentRules.push({rank: "13", name: "Make a Rule", instructions: "Make a Global Rule for the current game!"});
      allRules.push({rank: "13", name: "Make a Rule", instructions: "Make a Global Rule for the current game!"});

      games.push({
        gameName: "[Random Mix!]",
        created: new Date(Date.now()),
        admin: this.state.username,
        forkedFrom: this.state.username,
        versions: [
          {
            rules: allRules,
            date: new Date(Date.now()),
            versionName: "entire history"
          },
          {
            rules: recentRules,
            date: new Date(Date.now()),
            versionName: "most recent"
          }
        ],
      });
    }
    return games;
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
              versionIndex: res.data.versions.length - 1,
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
    const {currentGame, cards, cardAction} = this.state;
    if (!cardAction && (currentGame.gameName && cards.length > 0)) {
      const rules = this.state.rules;
      const card = this.state.cards.pop();
      const newBurn = this.state.burnedCards;
      newBurn.push(card);
      this.setState({
        currentCard: card,
        currentRule: rules[card.rank - 1],
        burnedCards: newBurn,
        deckEmpty: (this.state.cards.length === 0),
        cardAction: true
      });
      setTimeout(() => this.setState({cardAction:false}), 700); // use 100 for development, 700 for production
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
      <div className="dashboard-root">
        
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

          <div className="author d-flex justify-content-center align-items-center">
            {this.state.currentGame.forkedFrom !== this.state.username ? 
              <button className="btn btn-dark nav-button" onClick={() => this.searchUser(this.state.currentGame.forkedFrom)}>
                forked from:  <span>{this.state.currentGame.forkedFrom}</span>
              </button>
            :
              <button className="btn btn-dark nav-button" onClick={() => this.searchUser(this.state.currentGame.admin)}>
                by:  <span>{this.state.currentGame.admin}</span>
              </button>
            }
          </div>

          <div className="version d-flex justify-content-center align-items-center">
            {(this.state.newAce || localStorage.getItem(`versionState: ${this.state.currentGame.gameName}`)) ? 
              <button className="btn btn-dark nav-button" onClick={() => this.saveVersion()}><span>Save Current as Version</span></button> : 
              <button className="btn btn-dark nav-button" onClick={() => this.setState({redirectTo: "/edit"})}>Version:  <span>{this.state.currentVersion.versionName || "none!"}</span></button>
            }
          </div>
          
          <div className="decks">
            <img src={this.state.deckEmpty ? "./images/empty.png" : "./images/deck2.png"} 
                 className="deck"
                 style={!this.state.deckEmpty ?
                        {
                          top: (6.9 - (this.state.cards.length / 10)) + "%",
                          backgroundColor: "rgb(33, 25, 17)",
                          borderRight: (this.state.cards.length / 10) + "px solid rgb(51, 40, 29)",
                          borderBottom: (this.state.cards.length / 5) + "px solid rgb(27, 22, 17)",
                          height: 80 + parseFloat(this.state.cards.length / 10) + "%",
                        } :
                        {boxShadow: "0px 0px 0px 0px white"}
                      }
                 onClick={() => this.drawCard()}/>
          </div>
          
          <div className="current-cards">
            <img alt={this.state.currentCard.rank} 
                 src={this.state.currentCard.image} 
                 onClick={() => this.undo()}
                //  onMouseEnter={() => this.setState({ hover: true })}
                //  onMouseLeave={() => this.setState({ hover: false })}
                 className={this.state.cardAction ? "current-card card-action" : "current-card"}/>
            {/* <img alt="undo" src="./images/undo.png" 
                 onClick={() => this.undo()} 
                 onMouseEnter={() => this.setState({ hover: true })}
                 onMouseLeave={() => this.setState({ hover: false })}
                 className={this.state.hover ? "undo" : "undo"} /> */}
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
            <img className={this.state.burnedCards.length ? "hide" : "click-to-start"} onClick={() => this.drawCard()} alt="click to start" src="./images/click_here3.png" />
            <img className={this.state.burnedCards.length === 1 ? "click-to-continue" : "hide"} onClick={() => this.drawCard()} alt="click to continue" src="./images/click_here2.png" />
          </div>
          
          <div className="HUD">
            <div className={this.state.burnedCards.length ? 
              (this.state.currentCard.rank == 1 && !this.state.usedKAs.includes(this.state.currentCard.id)) ? "banner-turned faded" : "banner-turned" 
              : "hide"}>
              <img alt="banner" src="./images/regal6.png" />
            </div>
            {this.renderHUD()}
          </div>
          
        </div>

      </div>

    );
  }
}

export default Dashboard;
