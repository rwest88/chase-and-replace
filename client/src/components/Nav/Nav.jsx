import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

class Nav extends React.Component {

  state = {
    showDropdown: false
  }

  toggleDropdown = () => {
    if (this.state.showDropdown) this.setState({showDropdown: false});
    else this.setState({showDropdown: true});
  }

  signOut = () => {
    localStorage.clear();
    sessionStorage.clear();
  }
  
  render = ({games, loadGame} = this.props) => {

    return (
      <nav className="navbar navbar-expand-lg navbar-dark">
        <Link to="/" className="navbar-brand">Chase and Replace</Link>
        
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/dashboard"
                    className={
                    window.location.pathname === "/dashboard" ? "nav-link active" : "nav-link"
              }>
                Play
              </Link>
            </li>
            <li className={this.state.showDropdown ? "lime nav-item dropdown" : "nav-item dropdown"}>
              <a className="nav-link dropdown-toggle" href="#" onClick={() => this.toggleDropdown()} id="navbarDropdownMenuLink" data-toggle="" aria-haspopup="true" aria-expanded="false">
                Load Game
              </a>
              <div className={this.state.showDropdown ? "dropdown dropdown-menu dropdown-menu-right d-flex flex-column align-items-end" : "hide"} >
              <h6 class="dropdown-header">Your saved games</h6>
                {games.map(game => (
                  <div class="btn-group dropright">
                    <button type="button" class="btn dropdown-item"
                      onClick={() => {this.toggleDropdown(); loadGame(game)}}>
                      {game.gameName}
                    </button>
                    <button type="button" class="btn dropdown-item dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span class="sr-only">Toggle Dropright</span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right versions" >
                      <h6 class="dropdown-header">versions</h6>
                      {game.versions.map((version, index) => (
                        <button class="btn dropdown-item"
                          onClick={() => {this.toggleDropdown(); loadGame(game, index)}}>
                          {version.versionName}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </li>
            <li className="nav-item">
              <Link to="/edit"
                    className={
                    window.location.pathname === "/edit" ? "nav-link active" : "nav-link"
              }>
                Create / Edit Games
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/search"
                    className={
                    window.location.pathname === "/search" ? "nav-link active" : "nav-link"
              }>
                Search Games
              </Link>
            </li>
            {!localStorage.username ? // Check to see if user is logged in
              <li className="nav-item">
              <Link to="/dashboard"
                    className={
                    window.location.pathname === "/#" ? "nav-link active" : "nav-link"
              }>
                Sign In / Register
              </Link>
            </li>
            :  // Display sign in or sign out accordingly
            <li className="nav-item">
              <a className="nav-link" href="/dashboard" onClick={() => this.signOut()}>
                Sign Out
              </a>
            </li>
            }
            
          </ul>
        </div>
      </nav>
    )
  }
}

export default Nav;