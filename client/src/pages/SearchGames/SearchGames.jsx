import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Redirect } from "react-router-dom";
import API from "../../utils/API";
import "./SearchGames.css";
import cards from "../Dashboard/cards.json";
import games from "../Dashboard/games.json";

class SearchGames extends Component {

  state = { cards, games, userResults: [], gamesByUser: [[{gameName: "blank"}]] };

  // componentWillMount() {
  //   if (!sessionStorage.getItem('gameState')) {
  //     console.log('no session data');
  //   } else {
  //     console.log('yes session data');
  //     const sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
  //     sessionObject.redirectTo = false;
  //     this.setState(sessionObject);
  //     this.searchDB();
  //   }
  // }

  componentDidMount() {
    var sessionObject = JSON.parse(sessionStorage.getItem('gameState'));
    sessionObject.redirectTo = false;
    sessionObject.gamesByUser = [[{gameName: "blank"}]];
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
      else this.setState({userResults: [], gamesByUser: [[{gameName: "blank"}]]});
    });
    
    // API.searchDB(this.state.searchTerm)
    //   .then(searchResults => this.setState({searchResults}))
    //   .catch(err => console.log(err));
  }

  searchDB = () => {
    console.log("searching");
    API.getUser(this.state.searchTerm)
      .then(userRes => {
        if (userRes.data.length > 0) {
          let users = [];
          for (let i in userRes.data) {
            API.getGamesByUser({gameIDs: userRes.data[i].games})
            .then(gameRes => {
              users.push(gameRes.data)
              console.log(users);
              setTimeout(() => this.setState({userResults: userRes.data, gamesByUser: users}), 1000);
            })
            .catch(err => console.log(err));
          }
          
        } else {
          this.setState({userResults: [], gamesByUser: [[{gameName: "blank"}]]});
        }
      }).catch(err => console.log(err));
  }

  forkGame = id => {
    API.getGame(id)
      .then(game => {
        game.data._id = `${game.data.gameName} ${this.state.username} from ${game.data.admin}`;
        game.data.forkedFrom = game.data.admin;
        game.data.admin = this.state.username;
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

              <div className="list-group">
                {this.state.gamesByUser[0].map(item => (
                  <button 
                    // type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => this.forkGame(item._id)}
                    >
                    {item.gameName}
                  </button>
                ))}
              </div>

              {/* <div>{this.state.gamesByUser.map(item => <button onClick={() => this.forkGame(item._id)}>{item.gameName}</button>)}</div> */}
              

              asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf asdf asdf asdf jasdfkljalsdkfjakl sdfkladsj flk jasdflk ajsdfkjla sdfkl asdfkj aldsk fadskjl fakl sdjfkjl asdfkl jasdfjl asdkjl fakjl sdfkjl asdfkjl asdkjl fakjl sdfkjl adsfkjl asdfkjl 


            </div>

            <div className="col-sm-4">.col-sm-4
              <div id="menu">
                <div className="panel list-group">
                  <a href="#" className="list-group-item" data-toggle="collapse" data-target="#sm" data-parent="#menu">MESSAGES <span className="label label-info">5</span> <span className="glyphicon glyphicon-envelope pull-right"></span></a>
                  <div id="sm" className="sublinks collapse">
                    <a className="list-group-item small"><span className="glyphicon glyphicon-chevron-right"></span> inbox</a>
                    <a className="list-group-item small"><span className="glyphicon glyphicon-chevron-right"></span> sent</a>
                  </div>
                  <a href="#" className="list-group-item" data-toggle="collapse" data-target="#sl" data-parent="#menu">TASKS <span className="glyphicon glyphicon-tag pull-right"></span></a>
                  <div id="sl" className="sublinks collapse">
                    <a className="list-group-item small"><span className="glyphicon glyphicon-chevron-right"></span> saved tasks</a>
                    <a className="list-group-item small"><span className="glyphicon glyphicon-chevron-right"></span> add new task</a>
                  </div>
                  <a href="#" className="list-group-item">ANOTHER LINK ...<span className="glyphicon glyphicon-stats pull-right"></span></a>
                </div>
              </div>

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
                          <button type="submit" className="btn btn-primary"><i className="fas fa-search"></i></button>
                        </form>
                      </div>
                    </div>
                    <button type="button" onClick={this.searchDB} className="btn btn-primary"><i className="fas fa-search"></i></button>
                  </div>
                </div>
              </div>
              <br />
              

              <div id="accordion">
                <div className="card">
                  <div className="card-header" id="heading-1">
                    <h5 className="mb-0">
                      <a role="button" data-toggle="collapse" href="#collapse-1" aria-expanded="true" aria-controls="collapse-1">
                        Users matching "{this.state.searchTerm}"
                      </a>
                    </h5>
                  </div>
                  <div id="collapse-1" className="collapse show" data-parent="#accordion" aria-labelledby="heading-1">
                    <div className="card-body">

                      {this.state.userResults.map((user, index) => (

                        <div id="accordion-1">
                          <div className="card">
                            <div className="card-header" id={`heading-1-${index + 1}`}>
                              <h5 className="mb-0">
                                <a className="collapsed" role="button" data-toggle="collapse" href={`#collapse-1-${index + 1}`} aria-expanded="false" aria-controls={`collapse-1-${index + 1}`}>
                                  {user.userName}'s public games
                                </a>
                              </h5>
                            </div>
                            <div id={`collapse-1-${index + 1}`} className="collapse" data-parent="#accordion-1" aria-labelledby={`heading-1-${index + 1}`}>
                              <div className="card-body">
                              
                                {this.state.gamesByUser[index].map((game, gameIdx) => (

                                  <div id={`accordion-1-${index + 1}`}>
                                    <div className="card">
                                      <div className="card-header" id={`heading-1-${index + 1}-${gameIdx + 1}`}>
                                        <h5 className="mb-0">
                                          <a className="collapsed" role="button" data-toggle="collapse" href={`#collapse-1-${index + 1}-${gameIdx + 1}`} aria-expanded="false" aria-controls={`collapse-1-${index + 1}-${gameIdx + 1}`}>
                                            {game.gameName}
                                          </a>
                                        </h5>
                                      </div>
                                      <div id={`collapse-1-${index + 1}-${gameIdx + 1}`} className="collapse" data-parent={`#accordion-1-${index + 1}`} aria-labelledby={`heading-1-${index + 1}-${gameIdx + 1}`}>
                                        <div className="card-body">
                                          Text 1 > 1 > 1
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                ))}

                              </div>
                            </div>
                          </div>
                        </div> 

                      ))}
                    
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="heading-2">
                    <h5 className="mb-0">
                      <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
                        Games matching "{this.state.searchTerm}"
                      </a>
                    </h5>
                  </div>
                  <div id="collapse-2" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                    <div className="card-body">
                      Text 2
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="heading-3">
                    <h5 className="mb-0">
                      <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
                        Item 3
                      </a>
                    </h5>
                  </div>
                  <div id="collapse-3" className="collapse" data-parent="#accordion" aria-labelledby="heading-3">
                    <div className="card-body">
                      Text 3
                    </div>
                  </div>
                </div>
              </div>
              {/* sadfasdfasdf asdf asdf asdf asdf adsf asdf asdf adsf asdf asdf adsf adsf asdf asdf asdf adsf asdf adsf adsf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf asdf asdf asdf adsf asdf asdf asdf asdf asdf adsf adsf adsf kjas dfkjadsfkj hadskfj haskdjfh adskjfh askjdfh kasjdf  */}



            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchGames;