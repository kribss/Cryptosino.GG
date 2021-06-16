import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import CoinflipPage from "./components/Pages/CoinflipPage";
import JackpotPage from "./components/Pages/JackpotPage";
import HomePage from "./components/Pages/HomePage";
import CasinoPage from "./components/Pages/CasinoPage";
import Litepaper from "./components/Pages/Litepaper";
// import Clock from "./components/Clock/Clock";


const App = () => {

  return (
    <div className="App">

      {/* <Clock /> */}
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/Coinflip" exact component={CoinflipPage} />
          <Route path="/Jackpot" exact component={JackpotPage} />
          <Route path="/Casino" exact component={CasinoPage} />
          <Route path="/Litepaper" exact component={Litepaper} />




        </Switch>
      </Router>
    </div>
  );
}

export default App;
