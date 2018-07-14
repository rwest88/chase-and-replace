import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Redirect } from "react-router-dom";
import "./CreateEditGame.css";
import cards from "../Dashboard/cards.json";
import games from "../Dashboard/games.json";
import newGameTemplate from "../Dashboard/newGameTemplate.json";
import API from "../../utils/API";

class CreateEditGame extends Component {

  // ==============
  // Initialization
  // ==============

  state = { // SHRINK THIS?
    cards,
    games,
    newGameRules: newGameTemplate,
    usedKAs: [],
    // rules: newGameTemplate,
    oldRules: newGameTemplate,
    currentGame: {},
    versions: [{rules: newGameTemplate}],
    vers: 0,
  };

  // ==================
  // Life Cycle Methods
  // ==================

  componentDidMount() {
    const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    this.setState(this.pushBlankVersion(sessionObject, true));
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  // =============================
  // Functions related to Gameplay
  // =============================

  loadGame = (selectedGame, selectedVersion, createdNew) => {
    
    let rules;

    if (this.state.newAce === true && (this.state.currentGame)) {
      if (window.confirm(`Save current rule changes to ${this.state.currentGame.gameName}?  \n\n(Note: This will not create a new version. Click 'Save Current as Version' when you are happy with the set of rules.)`)) {
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
      redirectTo: "/dashboard",
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards || {})),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      games: createdNew ? this.state.games.concat(selectedGame) : this.state.games, // lets you load newly created game
      deckEmpty: false,
      currentGame: selectedGame,
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

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ==============
  // Form Functions
  // ==============

  handleInputChange = (index, property) => (event) => {
    let newRules = this.state.newGameRules;
    newRules[index + 1][property || event.target.name] = property ? "" : event.target.value;
    this.setState({ newGameRules: newRules, rules: this.state.oldRules, changedInput: true});
  };

  handleSelectChange = event => {
    let {value} = event.target;
    this.setState({
      vers: value,
      versionName: this.state.versions[value].versionName,
      newGameRules: this.state.versions[value].rules
    });
  }

  clearFields = () => {
    this.setState({newGameRules: newGameTemplate});
  }

  // =====================
  // Create/Edit Functions
  // =====================

  createNewGame = () => {
    const {newGameRules, versionName, username} = this.state;
    const errors = [];
    for (let i = 1; i < newGameRules.length - 1; i++) {
      if (!newGameRules[i].name) errors.push(`${newGameRules[i].rank}: name`);
      if (!newGameRules[i].instructions) errors.push(`${newGameRules[i].rank}: instructions`);
    }
    if (errors.length > 0) alert("Missing fields: \n" + errors.join("\n"));
    else {
      const entry = window.prompt(`Enter the name for your new game! (current name: ${versionName}) \n\n 13 character max`);
      API.saveNewGame({
        _id: versionName + " " + username + " " + Math.floor(Math.random() * 1000000),
        gameName: entry || versionName,
        admin: username,
        forkedFrom: username,
        created: new Date(Date.now()),
        ratings: [],
        saved: true,
        public: false,
        versions: [{
          versionName: "init",
          date: new Date(Date.now()),
          rules: newGameRules
        }]
      }).then(res => {
          this.setState({newGameRules: res.data.versions[0].rules, changedInput: false}, () => {
            if (window.confirm("New game created! Play now?")) this.loadGame(res.data, undefined, true);
          });
        }
      ).catch(err => console.log(err));
    }
  };

  deleteGame = () => {
    const {currentGame, username} = this.state;
    API.deleteGame(currentGame._id, username).then(res => {
      this.loadGame(this.state.games[0]);
    })
  }

  pushBlankVersion = (obj, didMount, createNew) => {
    const rules = obj.rules || this.state.rules;
    let blank = null;
    if (obj.newAce || this.state.newAce || createNew === true || (localStorage.getItem(`versionState: ${obj.gameName}`))) {
      
      let versions = obj.versions.filter(version => version.versionName !== "[NEW]");
      blank = {
        _id: "",
        versionName: "[NEW]",
        rules
      };
      versions.push(blank);
      obj.versions = versions;
      obj.vers = obj.versions.length - 1;
      obj.versionName = "[NEW]";
    } 
    else {
      obj.vers = obj.versionIndex;
    }
    if (didMount) {
      if (blank === null) obj.versionName = obj.versions[obj.vers].versionName;
    }
    obj.newGameRules = rules;
    return obj;
  }

  updateVersion = () => {
    let {newGameRules, versionName, currentGame, currentVersion, versions, vers, versionIndex, changedInput} = this.state;
    
    if (vers < 1) return window.alert("You cannot overwrite the original version!");
    if (!changedInput && versionName !== "[NEW]") return window.alert("You didn't change anything!");

    const errors = [];
    for (let i = 1; i < newGameRules.length - 1; i++) {
      if (!newGameRules[i].name) errors.push(`${newGameRules[i].rank}: name`);
      if (!newGameRules[i].instructions) errors.push(`${newGameRules[i].rank}: instructions`);
    }
    if (errors.length > 0) return alert("Missing fields: \n" + errors.join("\n"));

    const entry = window.prompt(`Rename? (current name: ${versionName})`);

    let version = {
      versionName: entry || versionName,
      date: new Date(Date.now()),
      rules: newGameRules
    }
    // console.log(versions.length - 1, vers);
    // console.log(currentVersion.versionName, versions[vers].versionName)
    if (versionName !== "[NEW]") {
      console.log("updating");
      version._id = versions[vers]._id;
      version.date = versions[vers].date;
      API.deleteVersion({gameID: currentGame._id, versionID: version._id})
        .then(res => API.pushVersion({gameID: currentGame._id, version})
          .then(res => API.getGame(currentGame._id)
            .then(res => this.setState({
              currentVersion: res.data.versions[versionIndex],
              rules: res.data.versions[versionIndex].rules,
              versions: this.pushBlankVersion(res.data, false).versions,
              changedInput: false,
              versionName: entry || versionName
            }))
          )
        ).catch(err => console.log(err))

    } else {
      console.log("pushing new");
      API.pushVersion({gameID: currentGame._id, version})
        .then(res => API.getGame(currentGame._id)
          .then(res => this.setState({
            versions: res.data.versions,
            currentVersion: res.data.versions[res.data.versions.length - 1],
            rules: res.data.versions[res.data.versions.length - 1].rules,
            oldRules: res.data.versions[res.data.versions.length - 1].rules,
            versionIndex: res.data.versions.length - 1,
            changedInput: false,
            versionName: entry || versionName,
            newAce: false
          }))
        ).catch(err => console.log(err));
    }

    localStorage.removeItem(`versionState: ${currentGame.gameName}`);
  }

  deleteVersion = () => {
    const {currentGame, currentVersion, versions, vers, versionIndex} = this.state;

    if (vers < 1) return window.alert("You cannot delete the original version!");
    if (versions[vers].versionName === "[NEW]") return window.alert("You can't delete what isn't saved!");
    if (currentVersion.versionName === versions[vers].versionName) {
      if (!window.confirm("Are you sure? This version is in progress!")) return false;
    }
    console.log("running delete");
    API.deleteVersion({gameID: currentGame._id, versionID: versions[vers]._id})
      .then(res => API.getGame(currentGame._id)
        .then(res => this.setState({
          versionIndex: (vers <= versionIndex) ? versionIndex - 1 : versionIndex,
          versions: this.pushBlankVersion(res.data, false).versions,
          vers: (versions.length -2 < vers) ? vers - 1 : vers,
        }))
      ).catch(err => console.log(err))
  }

  // ==================
  // Render Create/Edit
  // ==================

  render() {
    if (this.state.redirectTo && this.state.redirectTo !== "/edit") {
      return <Redirect to={this.state.redirectTo}/>;
    }
    return (
      <React.Fragment>

        <Nav games={this.state.games} loadGame={this.loadGame}/>

        <div className="container-fluid create-menu">
          <div class="row">
            <div class="col d-flex align-items-center">
              <p class="game-name ver">version:   </p>
              <select class="select-version" value={this.state.vers} onChange={this.handleSelectChange}>
                {this.state.versions.map((version, index) => {
                  return (
                    <option 
                      key={version.versionName} 
                      value={index}>
                      {version.versionName} {version.versionName === "[NEW]" ? "(current progress)" : `(Created: ${version.date})`}
                    </option>
                  )
                })}
              </select>  
            </div>
            <div class="col d-flex justify-content-around align-items-center">
              
              {/* <div class="row"> */}
                <div class="dropdown">
                  <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Edit Version
                  </button>
                  <div class="dropdown-menu edit" aria-labelledby="dropdownMenuButton">
                    <button class="btn btn-light dropdown-item" 
                      onClick={() => this.setState(this.pushBlankVersion(this.state, true, true))}>
                      <i class="fas fa-plus"></i> Create New...
                    </button>
                    <button class="btn btn-light dropdown-item" onClick={this.updateVersion}>Save Changes</button>
                    <button class="btn btn-light dropdown-item" onClick={this.deleteVersion}>Delete</button>
                  </div>
                </div>
                <p class="game-name">{this.state.currentGame.gameName}</p>
                <div class="dropdown">
                  <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Edit Game
                  </button>
                  <div class="dropdown-menu edit" aria-labelledby="dropdownMenuButton">
                    <button class="btn btn-light dropdown-item" onClick={this.updateGame}>Rename</button>
                    <button class="btn btn-light dropdown-item" onClick={this.deleteGame}>Delete</button>
                  </div>
                </div>
              {/* </div> */}
            </div>
            <div class="col d-flex justify-content-end align-items-center new-game">
              <button className="btn btn-light create-button" onClick={this.createNewGame}><i class="fas fa-plus"></i> Save As New Game</button>
              <button className="btn btn-light create-button" onClick={() => this.clearFields()}>Clear All Fields</button>
            </div>
          </div>
        </div>
            
        {this.state.versions[this.state.vers].rules.slice(1,12).map((rule, index) => (
        
          <div className="create-rule">

            <div style={{float: 'left'}}>
              <img className="rule-card" alt={rule.rank} src={`./images/${rule.rank}s.png`} />
            </div>

            <div className="rule-input-group">
              <div className="input-group mb-1">
                <div className="input-group-prepend">
                  <span className={this.state.newGameRules[index + 1].name ? "input-group-text" : "input-group-text bg-warning"}>Rule Name</span>
                </div>
                <button className="btn del" onClick={this.handleInputChange(index, "name")}><i class="fas fa-times"></i></button>
                <input type="text"
                  className="form-control"
                  placeholder={rule.name || this.state.oldRules[index + 1].name + " [current rule]"}
                  value={this.state.newGameRules[index + 1].name}
                  name="name"
                  onChange={this.handleInputChange(index)}
                />
              </div>
              
              <div className="input-group input-group-instr">
                <div className="input-group-prepend">
                  <span className={this.state.newGameRules[index + 1].instructions ? "input-group-text" : "input-group-text bg-warning"}>Instructions</span>
                </div>
                <button className="btn del" onClick={this.handleInputChange(index, "instructions")}><i class="fas fa-times"></i></button>
                <textarea type="text"
                  className="form-control"
                  placeholder={rule.instructions || this.state.oldRules[index + 1].instructions}
                  value={this.state.newGameRules[index + 1].instructions}
                  name="instructions"
                  onChange={this.handleInputChange(index)}
                />
              </div>
            </div>
          </div>
        ))}
        
      </React.Fragment>
    );
  }
}

export default CreateEditGame;