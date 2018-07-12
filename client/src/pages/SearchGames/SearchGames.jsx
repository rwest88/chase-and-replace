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
        game.data.created = new Date(Date.now());
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

        <div className="container-fluid">


          


          <div className="row">
          
            <div className="col-sm-4">


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


              asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf asdf asdf asdf jasdfkljalsdkfjakl sdfkladsj flk jasdflk ajsdfkjla sdfkl asdfkj aldsk fadskjl fakl sdjfkjl asdfkl jasdfjl asdkjl fakjl sdfkjl asdfkjl asdkjl fakjl sdfkjl adsfkjl asdfkjl 


            </div>

            <div className="col-sm-4">.col-sm-4
            

              dasfasdfklasdjflk asdflkj asdlfkjasdlfkj asdf adsf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf asdf asdf adsfkjl asdlfk adslfkj adslkfj asldkfj klj asdlk fasdklfj askldjf askldj flkasj dflkjads flkjas dfklj dsklj adslfkj sdlfkj asdlkfj asdlkfj sdlkfj sldkj fslkdj fskldj flksj dflkj sdfklj lskdj faldskf adsklfj aldskfj ladskfj adsfk jkjasdh fkjadshf kjadshf kjadshf 
            
            
            </div>





            <div className="col-sm-4">


              <div className="input-group adv-search">

                <input 
                  type="text"
                  className="form-control"
                  placeholder="search..."
                  name="searchTerm"
                  value={this.state.searchTerm}
                  onChange={this.handleInputChange}
                  onInput={this.handleInputChange}
                />
                <div className="input-group-btn">
                  <div className="btn-group" role="group">
                    <div className="dropdown dropdown-lg">
                      <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span className="caret">options</span></button>
                      <div className="dropdown-menu dropdown-menu-right" role="menu">
                        <form className="form-horizontal" role="form">
                          <div className="form-group">
                            <label for="filter">Filter by</label>
                            <select className="form-control">
                              <option value="0" selected>All Snippets</option>
                              <option value="1">Featured</option>
                              <option value="2">Most popular</option>
                              <option value="3">Top rated</option>
                              <option value="4">Most commented</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label for="contain">Author</label>
                            <input className="form-control" type="text" />
                          </div>
                          <div className="form-group">
                            <label for="contain">Contains the words</label>
                            <input className="form-control" type="text" />
                          </div>
                          <button type="submit" className="btn btn-primary"><i class="fas fa-search"></i></button>
                        </form>
                      </div>
                    </div>
                    <button type="button" onClick={this.searchDB} className="btn btn-primary"><i class="fas fa-search"></i></button>
                  </div>
                </div>
              </div>
              <br />
              <div class="list-group">
                <button type="button" class="list-group-item list-group-item-action active">
                  Cras justo odio
                </button>
                <button type="button" class="list-group-item list-group-item-action">Dapibus ac facilisis in</button>
                <button type="button" class="list-group-item list-group-item-action">Morbi leo risus</button>
                <button type="button" class="list-group-item list-group-item-action">Porta ac consectetur ac</button>
                <button type="button" class="list-group-item list-group-item-action" disabled>Vestibulum at eros</button>
              </div>
              sadfasdfasdf asdf asdf asdf asdf adsf asdf asdf adsf asdf asdf adsf adsf asdf asdf asdf adsf asdf adsf adsf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf adsf adsf adsf kjas dfkjadsfkj hadskfj haskdjfh adskjfh askjdfh kasjdf 



            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchGames;