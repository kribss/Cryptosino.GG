import React from "react";
import { Button } from "../Button/Button";
import "./casinohero.css";

function CasinoHero() {
  return (
    <div className="casinohero-container">
      <video src="/Videos/CasinoHome.mp4" autoPlay loop muted />
      <h1 className="welcome">Welcome To The</h1><br></br><h1 className="crypto">CryptoSino</h1>
      <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
          path="/casino"
        >
          Enter The Casino
        </Button>
      </div>
      <p>*Entering Casino Requires a Connected Web3 Wallet *</p>
      <div className="cryptosino-about-container">
        <h1>About the CryptoSino</h1>
        <p>The CryptoSino was started as an alternative to the typical centralised casino. CryptoSino is built upon the Ethereum Virtual Machine and secured using Chainlinks VRF. Furthermore, CryptoSino is entirely open source and can be viewed using the Github link below. Enjoy!</p>
        <a href="https://github.com/kribss/Cryptosino.GG" target="_blank">Github</a>
      </div>
    </div>
  );
}

export default CasinoHero;
