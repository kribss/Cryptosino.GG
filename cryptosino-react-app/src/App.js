import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import Coinflip from "./components/Coinflip/Coinflip";
import Jackpot from "./components/Jackpot/Jackpot.js";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/Coinflip" exact component={Coinflip} />
          <Route path="/Jackpot" exact component={Jackpot} />


        </Switch>
      </Router>
    </>
  );
}

export default App;
