import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingLogin from "./pages/LandingLogin";
import Dashboard from "./pages/Dashboard";


const App = () => (
  <Router>
    <div>
      
      <Switch>
        <Route exact path="/" component={LandingLogin} />
        <Route exact path="/dashboard" component={Dashboard} />
        
        
      </Switch>
    </div>
  </Router>
);

export default App;
