import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/Pages/LandingPage";


function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />

        </Switch>
      </Router>
    </>
  );
}

export default App;
