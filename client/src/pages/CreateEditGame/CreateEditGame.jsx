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
    versionID: "",
    clearedFields: true,
  };

  // ==================
  // Life Cycle Methods
  // ==================

  componentDidMount() {
    const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    sessionObject.clearedFields = false;
    this.setState(this.pushBlankVersion(sessionObject));
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  // =============================
  // Functions related to Gameplay
  // =============================

  loadGame = selectedGame => {

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

    this.setState({
      redirectTo: "/dashboard",
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards || {})),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
      games: this.state.games.concat(selectedGame),
      deckEmpty: false,
      currentGame: selectedGame,
      versions: selectedGame.versions,
      vers: selectedGame.versions.length - 1,
      currentVersion: selectedGame.versions[selectedGame.versions.length - 1],
      rules: rules || selectedGame.versions[selectedGame.versions.length - 1].rules,
      kingRules:[],
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

  handleNameChange = event => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  handleInputChange = (index) => (event) => {
    let newRules = this.state.newGameRules;
    newRules[index + 1][event.target.name] = event.target.value;
    this.setState({ newGameRules: newRules, rules: this.state.oldRules});
  };

  handleSelectChange = event => {
    let {value} = event.target;
    this.setState({
      vers: value,
      versionName: "",
      newGameRules: this.state.versions[value].rules,
      clearedFields: false
    });
  }

  // setRule = event => {
  //   event.preventDefault()
  //   const oldRules = this.state.newGameRules;
  //   const newRules = oldRules.filter(rule => rule.rank !== this.state.replace);
  //   newRules.push({
  //     rank: this.state.replace,
  //     name: this.state.ruleName,
  //     instructions: this.state.ruleInstructions
  //   });
  //   newRules.sort((a, b) => a.rank - b.rank);
  //   this.setState({
  //     newGameRules: newRules
  //   });
  // }

  // =====================
  // Create/Edit Functions
  // =====================

  createNewGame = event => {
    event.preventDefault();
    const {newGameRules, versionName, username} = this.state;
    const errors = [];
    for (let i = 1; i < newGameRules.length - 1; i++) {
      if (!newGameRules[i].name) errors.push(`${newGameRules[i].rank}: name`);
      if (!newGameRules[i].instructions) errors.push(`${newGameRules[i].rank}: instructions`);
    }
    if (errors.length > 0) alert("Missing fields: \n" + errors.join("\n"));
    else {
      API.saveNewGame({
        _id: versionName + " " + username + " " + Math.floor(Math.random() * 1000000),
        gameName: versionName,
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
          this.setState({newGameRules: res.data.versions[0].rules}, () => {
            if (window.confirm("New game created! Play now?")) this.loadGame(res.data);
          });
        }
      ).catch(err => console.log(err));
    }
  };

  clearFields = () => {
    this.setState({clearedFields: true, newGameRules: newGameTemplate});
  }

  pushBlankVersion = obj => {
    const rules = obj.rules || this.state.rules;
    if (obj.newAce || this.state.newAce || (localStorage.getItem(`versionState: ${obj.gameName}`))) {
      
      let versions = obj.versions.filter(version => version.versionName !== "[NEW]");
      let blank = {
        _id: "",
        versionName: "[NEW]",
        rules
      };
      versions.push(blank);
      obj.versions = versions;
      obj.vers = obj.versions.length - 1;
      
    }
    obj.newGameRules = rules;
    return obj;
  }

  loadVersion = event => {
    event.preventDefault();

  }

  updateVersion = event => {
    event.preventDefault();
    const {newGameRules, versionName, currentGame, currentVersion, versions, vers} = this.state;
    
    if (vers < 1) return window.alert("You cannot overwrite the original version!");

    let version = {
      versionName,
      date: new Date(Date.now()),
      rules: newGameRules
    }
    // console.log(versions.length - 1, vers);
    // console.log(currentVersion.versionName, versions[vers].versionName)
    if (parseInt(vers) !== versions.length - 1 || currentVersion.versionName === versions[vers].versionName) {
      console.log("updating");
      version._id = versions[vers]._id;
      version.date = versions[vers].date;
      API.deleteVersion({gameID: currentGame._id, versionID: version._id})
        .then(res => API.pushVersion({gameID: currentGame._id, version})
          .then(res => API.getGame(currentGame._id)
            .then(res => this.setState({
              currentVersion: res.data.versions[res.data.versions.length - 1],
              rules: res.data.versions[res.data.versions.length - 1].rules,
              versions: this.pushBlankVersion(res.data).versions,
              versionName: ""
            }))
          )
        ).catch(err => console.log(err))

    } else {
      console.log("pushing");
      API.pushVersion({gameID: currentGame._id, version})
        .then(res => API.getGame(currentGame._id)
          .then(res => this.setState({
            versions: res.data.versions,
            currentVersion: res.data.versions[res.data.versions.length - 1],
            rules: res.data.versions[res.data.versions.length - 1].rules,
            oldRules: res.data.versions[res.data.versions.length - 1].rules,
            versionName: "",
            newAce: false
          }))
        ).catch(err => console.log(err));
    }

    localStorage.removeItem(`versionState: ${currentGame.gameName}`);
  }

  deleteVersion = event => {
    event.preventDefault();
    const {currentGame, currentVersion, versions, vers} = this.state;

    if (vers < 1) return window.alert("You cannot delete the original version!");
    if (versions[vers].versionName === "[NEW]") return window.alert("You can't delete what isn't saved!");
    if (currentVersion.versionName === versions[vers].versionName) {
      if (!window.confirm("Are you sure? This version is in progress!")) return false;
    }
    console.log("running delete");
    API.deleteVersion({gameID: currentGame._id, versionID: versions[vers]._id})
      .then(res => API.getGame(currentGame._id)
        .then(res => this.setState({
          versions: this.pushBlankVersion(res.data).versions,
          vers: (res.data.versions.length < 2) ? 0 : vers,
        }))
      ).catch(err => console.log(err))
  }

  // ==================
  // Render Create/Edit
  // ==================

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>;
    }
    return (
      <React.Fragment>

        <Nav games={this.state.games} loadGame={this.loadGame}/>

        {/* <div className="container-fluid main-container"> */}

          <div className="container-fluid create-menu">
            <div class="row">
              <div class="col d-flex align-items-end">
                <select class="form-control" value={this.state.vers} onChange={this.handleSelectChange}>
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
              <div class="col">
                <h4 class="game-name">{this.state.currentGame.gameName}</h4>
                <div class="row d-flex justify-content-center">
                <div class="dropdown">
                  <button class="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Edit Version
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <button class="btn dropdown-item">Update</button>
                    <button class="btn dropdown-item">Delete</button>
                  </div>
                </div>
                <div class="dropdown">
                  <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Edit Game
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <button class="btn dropdown-item">Rename</button>
                    <button class="btn dropdown-item">Delete</button>
                  </div>
                </div>
                </div>
              </div>
              <div class="col d-flex justify-content-end align-items-end new-game">
                <button className="btn btn-light create-button" onClick={this.createNewGame}><i class="fas fa-plus"></i> Save As New Game</button>
                <button className="btn btn-light create-button" onClick={() => this.clearFields()}>Clear All Fields</button>
              </div>
            </div>
          </div>
              
          {/* <div className='container-fluid'> */}
            {this.state.newGameRules.slice(1,12).map((rule, index) => (
            
              <div className="create-rule">

                <div style={{float: 'left'}}>
                  <img className="rule-card" alt={rule.rank} src={`./images/${rule.rank}s.png`} />
                </div>

                <div className="rule-input-group">
                  <div className="input-group mb-1 d-flex justify-content-end">
                    <div className="input-group-prepend">
                      <span className={rule.name ? "input-group-text" : "input-group-text bg-warning"} id="inputGroup-sizing-default">Rule Name</span>
                    </div>
                    <input type="text"
                      className="form-control justify-content-end"
                      aria-label="Default" 
                      aria-describedby="inputGroup-sizing-default"
                      placeholder={rule.name || this.state.oldRules[index + 1].name + " [current rule]"}
                      name="name"
                      onChange={this.handleInputChange(index)}
                    />
                    <button className="btn del"><i class="fas fa-search"></i></button>
                  </div>
                  {/* <input class="swing" type="text" placeholder={this.state.oldRules[index + 1].name} /><label for="rule name">Rule Name</label> */}
                    
                  <div className="input-group input-group-instr d-flex justify-content-end">
                    <div className="input-group-prepend">
                      <span className={rule.instructions ? "input-group-text" : "input-group-text bg-warning"} id="inputGroup-sizing-default">Instructions</span>
                    </div>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder={rule.instructions || this.state.oldRules[index + 1].instructions}
                      value={rule.instructions}
                      name="instructions"
                      // onClick={}
                      onChange={this.handleInputChange(index)}
                    />
                    <button className="btn del">X</button>
                  </div>
                </div>
              </div>
            ))}
          {/* </div> */}
            
        {/* </div> */}
        

      </React.Fragment>
    );
  }
}

export default CreateEditGame;