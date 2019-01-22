import React, { Component } from "react";
import Nav from "../../components/Nav";
import { Redirect } from "react-router-dom";
import API from "../../utils/API";
import "./SearchGames.css";
import games from "../Dashboard/games.json";
import StarRatingComponent from "react-star-rating-component";

class SearchGames extends Component {

  state = { games, userResults: [], badges: [], showBadges: [false], lookingAt: {gameName: "blank"}, gamesByUser: [[{gameName: "blank"}]], titleResults: [{gameName: "blank"}]};

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
    sessionObject.titleResults = [{gameName: "blank"}];
    sessionObject.showBadges = [];
    sessionObject.games.forEach(() => sessionObject.showBadges.push(false));
    this.populateBadgesArray(sessionObject);
    this.setState(sessionObject, () => this.searchDB());
  }

  componentWillUnmount() {
    sessionStorage.setItem('gameState', JSON.stringify(this.state));
  }

  loadGame = (selectedGame, selectedVersion, createdNew) => {
    
    let { games } = this.state;
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

    if (selectedGame.gameName === "[Random Mix!]") {
      games = games.filter(game => game.gameName !== "[Random Mix!]");
      games = this.addRandom(games);
    }

    if (selectedVersion === undefined) selectedVersion = selectedGame.versions.length - 1;

    this.setState({
      redirectTo: "/dashboard",
      cards: this.shuffleArray(this.state.cards.concat(this.state.burnedCards || {})),
      burnedCards: [],
      currentRule: {},
      currentCard: {},
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
    const {searchTerm} = this.state;
    API.getUser(searchTerm)
      .then(userRes => {
        if (userRes.data.length > 0) {
          let users = [];
          for (let i in userRes.data) {
            API.getGamesByUser({gameIDs: userRes.data[i].games, search: true})
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
    API.searchGamesByName(searchTerm)
      .then(gameRes => this.setState({titleResults: gameRes.data}));
  }

  togglePublic = (id) => {
    API.togglePublic({gameID: id})
      .then(res => {
        console.log(res);
        if (res.data.nModified > 0) {
          let {games, showBadges} = this.state;
          for (let i in games) {
            if (games[i]._id === id) {
              games[i].public = !games[i].public;
              if (!games[i].public) showBadges[i] = false;
            }
          }
          this.setState({games, showBadges});
        }
      })
      .catch(err => console.log(err));
  }

  toggleBadges = index => {
    let {showBadges} = this.state;
    showBadges[index] = !showBadges[index];
    this.setState({showBadges});
  }

  populateBadgesArray = obj => {

    const badges = [
      {classes: "btn badge badge-primary", name: "Interactive"},
      {classes: "btn badge badge-primary", name: "Small Groups"},
      {classes: "btn badge badge-primary", name: "Large Groups"},
      {classes: "btn badge badge-primary", name: "Themed"},
      {classes: "", name: ""},
      {classes: "btn badge badge-secondary", name: "Cerebral"},
      {classes: "btn badge badge-secondary", name: "Trivial"},
      {classes: "btn badge badge-secondary", name: "Pop-Culture"},
      {classes: "", name: ""},
      {classes: "btn badge badge-success", name: "Family-Friendly"},
      {classes: "btn badge badge-success", name: "Social"},
      {classes: "btn badge badge-success", name: "Conversational"},
      {classes: "", name: ""},
      {classes: "btn badge badge-danger", name: "Adult"},
      {classes: "btn badge badge-danger", name: "Insulting"},
      {classes: "btn badge badge-danger", name: "Brutal"},
      {classes: "", name: ""},
      {classes: "btn badge badge-warning", name: "Physical"},
      {classes: "btn badge badge-warning", name: "Challenging"},
      {classes: "btn badge badge-warning", name: "Technical"},
      {classes: "", name: ""},
      {classes: "btn badge badge-info", name: "Silly"},
      {classes: "btn badge badge-info", name: "Funny"},
      {classes: "btn badge badge-info", name: "Surreal"},
      {classes: "btn badge badge-info", name: "Serious"},
      {classes: "btn badge badge-info", name: "Depressing"},
      {classes: "", name: ""},
      {classes: "btn badge badge-light", name: "Low-Key"},
      {classes: "btn badge badge-light", name: "Relaxing"},
      {classes: "btn badge badge-light", name: "Pensive"},
      {classes: "", name: ""},
      {classes: "btn badge badge-dark", name: "Loud"},
      {classes: "btn badge badge-dark", name: "Rambunctious"},
      {classes: "btn badge badge-dark", name: "Painful"},
    ];
    
    obj.badges = badges;
    return obj;
  }

  addBadge = (badge, id) => {
    API.addSearchTag({badge, id})
      .then(res => {
        console.log(res);
        if (res.data.nModified > 0) {
          let {games} = this.state;
          for (let i in games) if (games[i]._id === id) games[i].tags.push(badge.name)
          this.setState({games});
        }
      })
      .catch(err => console.log(err));
  }

  removeBadge = (badge, id) => {
    API.removeSearchTag({badge, id})
      .then(res => {
        console.log(res);
        if (res.data.nModified > 0) {
          let {games} = this.state;
          for (let i in games) if (games[i]._id === id) games[i].tags = games[i].tags.filter(tag => tag !== badge.name);
          this.setState({games});
        }
      })
      .catch(err => console.log(err));
  }

  addToSearch = (badge) => {
    let {searchTags} = this.state;
    if (searchTags) searchTags = searchTags + ", " + badge.name;
    else searchTags = badge.name;
    this.setState({searchTags});
  }

  forkGame = id => {
    API.getGame(id)
      .then(game => {
        game.data._id = `${game.data.gameName} ${this.state.username} from ${game.data.admin}`;
        game.data.forkedFrom = game.data.admin;
        game.data.admin = this.state.username;
        game.data.created = new Date(Date.now());
        game.data.public = false;
        API.saveNewGame(game.data)
          .then(res => {
            if (window.confirm("New game created! Play now?")) this.loadGame(res.data);
          }).catch(err => console.log(err));
      }).catch(err => console.log(err));
  }

  onStarClick = (nextValue, prevValue, name) => {
    this.setState({rating: nextValue}, () => {
      console.log(name);
    });
    
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

              <h1>Your Games:</h1>

              {this.state.games.slice(0, -1).map((game, index) => (
                <div className="card text-white bg-dark">
                  <div className="card-header" id={`heading-${index + 7}`}>
                    <h5 className="mb-0">
                      <a className="collapsed" role="button" data-toggle="collapse" href={`#collapse-${index + 7}`} aria-expanded="false" aria-controls={`collapse-${index + 7}`}>
                        {game.gameName}
                      </a>
                    </h5>
                  </div>
                  <div id={`collapse-${index + 7}`} className="collapse" data-parent="#accordion" aria-labelledby={`heading-${index + 7}`}>
                    <div className="card-body">
                      A game about stuff. <i class="btn fas fa-edit" style={{float: "right"}}></i>
                      {game.public ? (
                        <React.Fragment>
                          <br /><br />
                          Tags: 
                          {this.state.badges.filter(badge => game.tags.includes(badge.name)).map(badge => (
                            <span className={badge.classes} onClick={() => this.removeBadge(badge, game._id)}>
                              {badge.name ? badge.name : <br />}
                            </span>
                          ))}
                          <br /><br />
                          <button className="btn btn-primary" onClick={() => this.toggleBadges(index)}>
                            {this.state.showBadges[index] ? "Finish adding tags" : "Add tags..."}
                          </button>
                        </React.Fragment>
                      ) : ""
                      }
                      <br /><br />
                      <div className={this.state.showBadges[index] && game.public ? "" : "hide"}>
                        
                        {this.state.badges.filter(badge => !game.tags.includes(badge.name)).map(badge => (
                          <span className={badge.classes} onClick={() => this.addBadge(badge, game._id)}>
                            {badge.name ? badge.name : <br />}
                          </span>
                        ))}
                        <br /><br />
                      </div>
                      <button className="btn btn-primary" onClick={() => this.togglePublic(game._id)}>
                        {game.public ? "Make Private" : "Make Public"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>

            <div className="col-sm-4">
              
              <h1>Viewing:</h1>

              <div className="card text-white bg-dark">
                <div className="card-header" id="heading-4">
                  <h5 className="mb-0">
                    <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-4" aria-expanded="false" aria-controls="collapse-4">
                    {this.state.lookingAt.gameName} by {this.state.lookingAt.admin}
                    </a>
                  </h5>
                </div>
                <div id="collapse-4" className="collapse" data-parent="#accordion" aria-labelledby="heading-4">
                  <div className="card-body">
                    A game about stuff.
                    <br /><br />
                    Tags: 
                      {this.state.badges.filter(badge => this.state.lookingAt.tags.includes(badge.name)).map(badge => (
                        <span className={badge.classes}>
                          {badge.name ? badge.name : <br />}
                        </span>
                      ))}
                    <br /><br />
                    <button 
                    // type="button"
                    className="btn btn-primary"
                    onClick={() => this.forkGame(this.state.lookingAt._id)}
                    >
                    Fork This Game!
                  </button>
                  </div>
                </div>
              </div>
              <div className="card text-white bg-dark">
                <div className="card-header" id="heading-5">
                  <h5 className="mb-0">
                    <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-5" aria-expanded="false" aria-controls="collapse-5">
                      Ratings
                    </a>
                  </h5>
                </div>
                <div id="collapse-5" className="collapse" data-parent="#accordion" aria-labelledby="heading-5">
                  <div className="card-body">
                  
                  <StarRatingComponent
    name={"starRating"} /* name of the radio input, it is required */
    value={this.state.rating} /* number of selected icon (`0` - none, `1` - first) */
    starCount={10} /* number of icons in rating, default `5` */
    onStarClick={this.onStarClick} /* on icon click handler */
    /* on icon hover handler */
    // onStarHoverOut={Function(nextValue, prevValue, name)} /* on icon hover out handler */
    // renderStarIcon={Function(nextValue, prevValue, name)} /* it should return string or react component */
    // renderStarIconHalf={Function(nextValue, prevValue, name)} /* it should return string or react component */
    // starColor={String} /* color of selected icons, default `#ffb400` */
    // emptyStarColor={String} /* color of non-selected icons, default `#333` */
    // editing={Boolean} /* is component available for editing, default `true` */
/>


                  </div>
                </div>
              </div>
              <div className="card text-white bg-dark">
                <div className="card-header" id="heading-6">
                  <h5 className="mb-0">
                    <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-6" aria-expanded="false" aria-controls="collapse-6">
                      Rules
                    </a>
                  </h5>
                </div>
                <div id="collapse-6" className="collapse" data-parent="#accordion" aria-labelledby="heading-6">
                  <div className="card-body">
                    <div id="menu" style={{color: "black"}}>
                      <div className="panel list-group">
                        <a href="#" className="list-group-item list-group-item-primary" data-toggle="collapse" data-target="#sm" data-parent="#menu">MESSAGES <span className="label label-info">5</span> <span className="glyphicon glyphicon-envelope pull-right"></span></a>
                        <div id="sm" className="sublinks collapse">
                          <a className="list-group-item list-group-item-primary small"><span className="glyphicon glyphicon-chevron-right"></span> inbox</a>
                          <a className="list-group-item list-group-item-primary small"><span className="glyphicon glyphicon-chevron-right"></span> sent</a>
                        </div>
                        <a href="#" className="list-group-item list-group-item-dark" data-toggle="collapse" data-target="#sl" data-parent="#menu">TASKS <span className="glyphicon glyphicon-tag pull-right"></span></a>
                        <div id="sl" className="sublinks collapse">
                          <a className="list-group-item list-group-item-dark small"><span className="glyphicon glyphicon-chevron-right"></span> saved tasks</a>
                          <a className="list-group-item list-group-item-dark small"><span className="glyphicon glyphicon-chevron-right"></span> add new task</a>
                        </div>
                        <a href="#" className="list-group-item list-group-item-dark">ANOTHER LINK ...<span className="glyphicon glyphicon-stats pull-right"></span></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
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
                      <div className="dropdown-menu dropdown-menu-right search-dropdown" role="menu">
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
                          {/* <div className="form-group">
                            <label for="contain">Author</label>
                            <input className="form-control" type="text" />
                          </div> */}
                          <div className="form-group">
                            <label for="contain">Contains tags:</label>
                            <br />
                            {this.state.badges.map(badge => (
                              <span className={badge.classes} onClick={() => this.addToSearch(badge)}>
                                {badge.name ? badge.name : <br />}
                              </span>
                            ))}
                            <br /><br />
                            <input className="form-control" name="searchTags" value={this.state.searchTags} placeholder="Tags..." onChange={this.handleInputChange} type="text" />
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
                <div className="card text-white bg-dark">
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
                                    <div className="card text-white bg-dark">
                                      <div className="card-header" id={`heading-1-${index + 1}-${gameIdx + 1}`}>
                                        <h5 className="mb-0">
                                          <a className="collapsed" role="button" data-toggle="collapse" href={`#collapse-1-${index + 1}-${gameIdx + 1}`} aria-expanded="false" aria-controls={`collapse-1-${index + 1}-${gameIdx + 1}`}>
                                            {game.gameName}
                                          </a>
                                        </h5>
                                      </div>
                                      <div id={`collapse-1-${index + 1}-${gameIdx + 1}`} className="collapse" data-parent={`#accordion-1-${index + 1}`} aria-labelledby={`heading-1-${index + 1}-${gameIdx + 1}`}>
                                        <div className="card-body">
                                          <button className="btn btn-light" onClick={() => this.setState({lookingAt: game})}>See details...</button>
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
                <div className="card text-white bg-dark">
                  <div className="card-header" id="heading-2">
                    <h5 className="mb-0">
                      <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
                        Games matching "{this.state.searchTerm}"
                      </a>
                    </h5>
                  </div>
                  <div id="collapse-2" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                    <div className="card-body">
                      
                    {this.state.titleResults.map((title, index) => (

                      <div id="accordion-1">
                        <div className="card">
                          <div className="card-header" id={`heading-1-${index + 1}`}>
                            <h5 className="mb-0">
                              <a className="collapsed" role="button" data-toggle="collapse" href={`#collapse-1-${index + 1}`} aria-expanded="false" aria-controls={`collapse-1-${index + 1}`}>
                                {title.gameName}
                              </a>
                            </h5>
                          </div>
                          <div id={`collapse-1-${index + 1}`} className="collapse" data-parent="#accordion-1" aria-labelledby={`heading-1-${index + 1}`}>
                            <div className="card-body">
                            
                              <button className="btn btn-light" onClick={() => this.setState({lookingAt: title})}>See details...</button>

                            </div>
                          </div>
                        </div>
                      </div> 

                      ))}

                    </div>
                  </div>
                </div>
                <div className="card text-white bg-dark">
                  <div className="card-header" id="heading-3">
                    <h5 className="mb-0">
                      <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
                        Tags matching "{this.state.searchTerm}"
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


            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchGames;