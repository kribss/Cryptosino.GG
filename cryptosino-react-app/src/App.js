import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import CoinflipPage from "./components/Pages/CoinflipPage";
import JackpotPage from "./components/Pages/JackpotPage";
import HomePage from "./components/Pages/HomePage";
import CasinoPage from "./components/Pages/CasinoPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/Coinflip" exact component={CoinflipPage} />
          <Route path="/Jackpot" exact component={JackpotPage} />
          <Route path="/Casino" exact component={CasinoPage} />


        </Switch>
      </Router>
    </div>
  );
}

export default App;
