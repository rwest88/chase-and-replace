import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

class Nav extends React.Component {
  
  render = ({games, loadGame} = this.props) => {

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-green">
        <a className="navbar-brand" href="/dashboard">Chase and Replace</a>
        
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
                Play {/*<span className="sr-only">(current)</span>*/}
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Load Game
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {games.map(game => (
                  <button className="dropdown-item" onClick={() => loadGame(game)}>{game.gameName}</button>
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
            <li className="nav-item">
              <Link to="/edit"
                    className={
                    window.location.pathname === "/edit" ? "nav-link active" : "nav-link"
              }>
                Sign In / Register
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Nav;