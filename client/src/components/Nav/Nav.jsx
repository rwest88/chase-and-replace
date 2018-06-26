import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = () => (
<nav className="navbar navbar-expand-lg navbar-light bg-green">
  <a className="navbar-brand" href="/dashboard">Chase and Replace</a>
  
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNavDropdown">
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/dashboard"
              className={
              window.location.pathname === "/dashboard" ? "nav-link active" : "nav-link"
        }>
          Home <span className="sr-only">(current)</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/edit"
              className={
              window.location.pathname === "/edit" ? "nav-link active" : "nav-link"
        }>
          Create / Edit Game
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
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Load Game
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
    </ul>
  </div>
</nav>
);

export default Nav;