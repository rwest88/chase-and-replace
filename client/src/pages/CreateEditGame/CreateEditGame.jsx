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
    versionID: ""
  };

  // ==================
  // Life Cycle Methods
  // ==================

  componentDidMount() {
    const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
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
    this.setState({ newGameRules: newRules, rules: this.state.oldRules });
    console.log(this.state.oldRules[1].name)
  };

  handleSelectChange = event => {
    let {value} = event.target;
    this.setState({
      vers: value,
      versionName: "",
      newGameRules: this.state.versions[value].rules
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

  loadTemplate = event => {
    event.preventDefault();

  }

  clearFields = event => {
    event.preventDefault();
    
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

        <h1>Create Edit Page</h1>
        
        <form>
          <h6>{this.state.currentGame.gameName}</h6>

          <select value={this.state.vers} onChange={this.handleSelectChange}>
            {
              this.state.versions.map((version, index) => {
                return (
                  <option 
                    key={version.versionName} 
                    value={index}>
                    {version.versionName} {version.versionName === "[NEW]" ? "(current progress)" : `(Created: ${version.date})`}
                  </option>
                )
              })
            }
          </select>  

          <input
            type="text"
            placeholder="rename here..."
            name="versionName"
            value={this.state.versionName}
            onChange={this.handleNameChange}
          />
          
          <br />

          <button onClick={this.createNewGame}>Save As New Game</button>
          <button onClick={this.loadTemplate}>Load Kings Template</button>
          <button onClick={this.clearFields}>Clear All Fields</button>
          <br />
          <button onClick={this.loadVersion}>Load This Version</button>
          <button onClick={this.updateVersion}>Update Version</button>
          <button onClick={this.deleteVersion}>Delete Version</button>

          <br/><br/>
          
          {this.state.newGameRules.slice(1,12).map((rule, index) => (

            <div style={{clear: 'both '}}>
              <div style={{float: 'left'}}>
                <img className="rule-card" alt={rule.rank} style={{height: 16 + 'vh'}} src={`./images/${rule.rank}s.png`} />
              </div>
              <div style={{float: 'left'}}>
                <div className="input-group mb-1">
                  <div className="input-group-prepend">
                    <span className={rule.name ? "input-group-text" : "input-group-text bg-warning"} id="inputGroup-sizing-default">Rule Name</span>
                  </div>
                  <input type="text" 
                    className="form-control"
                    // aria-label="Default" 
                    // aria-describedby="inputGroup-sizing-default"
                    placeholder={this.state.oldRules[index + 1].name}
                    value={rule.name} // this can be optional
                    name="name"
                    onChange={this.handleInputChange(index)}
                  />
                </div>
                  
                <div className="input-group">
                  <div className="input-group-prepend">
                  <span className={rule.instructions ? "input-group-text" : "input-group-text bg-warning"} id="inputGroup-sizing-default">Rule Name</span>
                  </div>
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder={this.state.oldRules[index + 1].instructions}
                    value={rule.instructions} // this can be optional
                    name="instructions"
                    onChange={this.handleInputChange(index)}
                  />
                </div>
              </div>
              <br/>
            </div>

          ))}

          
        </form>
        

      </React.Fragment>
    );
  }
}

export default CreateEditGame;