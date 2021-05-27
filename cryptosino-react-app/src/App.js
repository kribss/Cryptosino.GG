import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import CoinflipPage from "./components/Pages/CoinflipPage";
import JackpotPage from "./components/Pages/JackpotPage";
import HomePage from "./components/Pages/HomePage";
import CasinoPage from "./components/Pages/CasinoPage";
// import Clock from "./components/Clock/Clock";
import Particles from 'react-particles-js';


class App extends React.Component {
  render() {
    return (
      <div className="App">

        {/* <Clock /> */}
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
}
export default App;
