import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Redirect } from "react-router-dom";
import API from "../../utils/API";
import "./SearchGames.css";
import cards from "../Dashboard/cards.json";
import games from "../Dashboard/games.json";

class SearchGames extends Component {

  state = { cards, games, gamesByUser: [] };

  componentWillMount() {
    if (!sessionStorage.getItem('gameState')) {
      console.log('no session data');
    } else {
      console.log('yes session data');
      const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
      sessionObject.redirectTo = false;
      this.setState(sessionObject);
      this.searchDB();
    }
  }

  componentDidMount() {
    var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    sessionObject.redirectTo = false;
    this.setState(sessionObject);
    this.searchDB();
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

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
      redirectTo: "/dashboard",
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

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({[name]: value}, () => {
      if (value.length > 2) this.searchDB();
      else this.setState({userResult: [], gamesByUser: []});
    });
    
    // API.searchDB(this.state.searchTerm)
    //   .then(searchResults => this.setState({searchResults}))
    //   .catch(err => console.log(err));
  }

  searchDB = () => {
    console.log("searching");
    API.getUser(this.state.searchTerm)
      .then(user => {
        if (user.data.length > 0) {
          API.getGamesByUser({gameIDs: user.data[0].games})
            .then(res => this.setState({userResult: user.data[0].userName, gamesByUser: res.data}))
            .catch(err => console.log(err));
        } else {
          this.setState({userResult: [], gamesByUser: []});
        }
      }).catch(err => console.log(err));
  }

  forkGame = id => {
    API.getGame(id)
      .then(game => {
        game.data._id = `${game.data.gameName} ${this.state.username} from ${game.data.admin}`;
        game.data.admin = this.state.username;
        game.data.forkedFrom = game.data.admin;
        API.saveNewGame(game.data)
          .then(res => {
            if (window.confirm("New game created! Play now?")) this.loadGame(res.data);
          }).catch(err => console.log(err));
      }).catch(err => console.log(err));
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>;
    }
    return (
      <React.Fragment>
        <Nav games={this.state.games} loadGame={this.loadGame}/>

        <h1>Search Page</h1>

        <form>
          <input 
            type="text"
            placeholder="search..."
            name="searchTerm"
            value={this.state.searchTerm}
            onChange={this.handleInputChange}
            onInput={this.handleInputChange}
          />
        </form>

        <h3>{this.state.userResult}</h3>

        <div>{this.state.gamesByUser.map(item => <button onClick={() => this.forkGame(item._id)}>{item.gameName}</button>)}</div>

      </React.Fragment>
    );
  }
}

export default SearchGames;