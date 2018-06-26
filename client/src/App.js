import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingLogin from "./pages/LandingLogin";
import Dashboard from "./pages/Dashboard";
import CreateEditGame from "./pages/CreateEditGame";
import SearchGames from "./pages/SearchGames";
import NoMatch from "./pages/NoMatch_old";


const App = () => (
  <Router>
    <div>
      
      <Switch>
        <Route exact path="/" component={LandingLogin} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/edit" component={CreateEditGame} />
        <Route exact path="/search" component={SearchGames} />

      </Switch>
    </div>
  </Router>
);

export default App;
