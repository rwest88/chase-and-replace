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

  componentDidMount() {  // SHRINK THIS
    const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    console.log(sessionObject);
    const rules = sessionObject.rules;
    let versions = sessionObject.versions;
    let pee = {
      _id: "",
      versionName: "[UNNAMED] (current)",
      rules
    };
    let vs = versions.filter(version => version.versionName !== "[UNNAMED] (current)");
    vs.push(pee);
    console.log(vs);
    sessionObject.versions = vs;
    sessionObject.vers = vs.length - 1;
    this.setState(sessionObject);
    console.log("tits");
    this.setState({newGameRules: rules}); // suspect
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
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
    console.log(vers);
    if (vers > 0) {
      console.log("running delete");
      API.deleteVersion({gameID: currentGame._id, versionID: versions[vers]._id})
        .then(res => API.getGame(currentGame._id)
          .then(res => this.setState({
            newGameRules: newGameTemplate,
            versions: res.data.versions,
            vers: (res.data.versions.length < 2) ? 0 : vers,
          }))
        )
        .catch(err => console.log(err))
    }
  }

  updateVersion = event =>{
    event.preventDefault()
    const {newGameRules, versionName, currentGame, versions, vers} = this.state;

    const version = {
      versionName: versionName,
      date: new Date(Date.now()),
      rules: newGameRules
    }

    API.pushVersion({gameID: this.state.currentGame._id, version})
    .then(res => {
      localStorage.removeItem(`versionState: ${this.state.currentGame.gameName}`);
      console.log(res.data);
      API.getGame(this.state.currentGame._id)
        .then(res => this.setState({
          versions: res.data.versions,
          currentVersion: res.data.versions[res.data.versions.length - 1],
          rules: res.data.versions[res.data.versions.length - 1].rules,
          oldRules: res.data.versions[res.data.versions.length - 1].rules,
          newAce: false
        })
      );
    })
    .catch(err => console.log(err));
  }

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
                return <option key={version.versionName} value={index}>{version.versionName} (Created: {version.date})</option>
              })
            }
          </select>  





          <input
            type="text"
            placeholder={this.state.oldRules[1].name}
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
                  <span className="input-group-text" id="inputGroup-sizing-default">Rule Name</span>
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
                  <span className="input-group-text">Instructions</span>
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