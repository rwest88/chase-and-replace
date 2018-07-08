import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Redirect } from "react-router-dom";
import "./CreateEditGame.css";
import cards from "../Dashboard/cards.json";
import games from "../Dashboard/games.json";
import newGameTemplate from "../Dashboard/newGameTemplate.json";
import API from "../../utils/API";

class CreateEditGame extends Component {

  state = { // SHRINK THIS?
    cards,
    games,
    newGameRules: newGameTemplate,
    usedKAs: [],
    createdNew: false,
    // rules: newGameTemplate,
    oldRules: newGameTemplate,
    currentGame: {},
    versions: [{rules: newGameTemplate}],
    versionID: "",
    z: "z"
  };

  componentDidMount() {
    const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    this.setState(this.pushBlankVersion(sessionObject));
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  pushBlankVersion = obj => {
    const rules = obj.rules || this.state.oldRules;
    let versions = obj.versions.filter(version => version.versionName !== "[NEW]");
    let blank = {
      _id: "",
      versionName: "[NEW]",
      rules
    };
    versions.push(blank);
    obj.versions = versions;
    obj.vers = versions.length - 1;
    obj.newGameRules = rules;
    return obj;
  }

  loadGame = selectedGame => {
    if (!this.state.currentGame) console.log("piss");
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

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////

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

  // handleFormSubmit = event => {
  //   event.preventDefault();
  //   const {newGameRules} = this.state;
  //   const errors = [];
  //   for (let i = 1; i < newGameRules.length - 1; i++) {
  //     if (!newGameRules[i].name) errors.push(`${newGameRules[i].rank}: name`);
  //     if (!newGameRules[i].instructions) errors.push(`${newGameRules[i].rank}: instructions`);
  //   }
  //   if (errors.length > 0) alert("Missing fields: \n" + errors.join("\n"));
  //   else {
  //     API.saveNewGame({
  //       _id: this.state.gameName + "_" + this.state.username,
  //       gameName: this.state.gameName,
  //       admin: this.state.username,
  //       forkedFrom: this.state.username,
  //       created: new Date(Date.now()),
  //       ratings: [],
  //       saved: true,
  //       public: false,
  //       versions: [
  //         {
  //           versionName: "init",
  //           date: new Date(Date.now()),
  //           rules: newGameRules
  //         }
  //       ]
  //     });
  //     this.setState({
  //       createdNew: true, 
  //       newGameRules: newGameTemplate, 
  //       replace: "",
  //       ruleName: "",
  //       ruleInstructions: "",
  //     });
  //   }
  // };

  deleteVersion = event => {
    event.preventDefault();
    const {currentGame, versions, vers} = this.state;

    if (vers < 1) return window.alert("You cannot delete the original version!");
    if (vers === versions.length - 1) return window.alert("Nothing to delete!");
  
    console.log("running delete");
    API.deleteVersion({gameID: currentGame._id, versionID: versions[vers]._id})
      .then(res => API.getGame(currentGame._id)
        .then(res => this.setState({
          versions: res.data.versions,
          vers: (res.data.versions.length < 2) ? 0 : vers,
        }))
      ).catch(err => console.log(err))
  }

  updateVersion = event =>{
    event.preventDefault();

    if (vers < 1) return window.alert("You cannot overwrite the original version!");

    const {newGameRules, versionName, currentGame, versions, vers} = this.state;
    let version = {
      versionName: versionName,
      date: new Date(Date.now()),
      rules: newGameRules
    }

    if (vers !== versions.length - 1) {
      console.log("updating");
      version._id = versions[vers]._id;
      version.date = versions[vers].date;
      API.deleteVersion({gameID: currentGame._id, versionID: version._id})
        .then(res => API.pushVersion({gameID: currentGame._id, version})
          .then(res => API.getGame(currentGame._id)
            .then(res => this.setState({
              versions: this.pushBlankVersion(res.data).versions
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
            newAce: false
          }))
        ).catch(err => console.log(err));
    }

    localStorage.removeItem(`versionState: ${currentGame.gameName}`);
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
          <h6>Select which version to change</h6>
          <select value={this.state.versionName} onChange={this.handleSelectChange}>
            
            {
              this.state.versions.map((version, index) => {
                return <option key={version.versionName} value={version.versionName}>{version.versionName}</option>
              })
            }
            <option value="(this.state.versionName)" selected>(current)</option>
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

          <button onClick={this.updateVersion}>Update</button>
          <button onClick={this.deleteVersion}>Delete</button>

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