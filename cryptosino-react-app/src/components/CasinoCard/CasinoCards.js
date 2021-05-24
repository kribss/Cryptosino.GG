import React from "react";
import CasinoCardItem from "./CasinoCardItem";
import "./CasinoCards.css";

function CasinoCards() {
  return (
    <div className="casinocards">
      <div className="casinocards__container">
        <img
          className="casinocards__background"
          src="Images/PlaceholderBackground.jpg"
          alt="PlaceholderBackground"
        ></img>
        <h1>Games</h1>
        <div className="casinocards__wrapper">
          <ul className="casinocards__items">
            <CasinoCardItem
              src="Images/blackjack.jpg"
              text="Black Jack"
              label="COMING SOON"
            />
            <CasinoCardItem
              src="Images/LOTTO-BALLS.jpg"
              text="Jackpot"
              label="Play Now"
              path="jackpot"
            />
            <CasinoCardItem
              src="Images/coinflip.png"
              text="Coin Flip"
              label="Play Now"
              path="coinflip"
            />

          </ul>
        </div>
      </div>
    </div>
  );
}

export default CasinoCards;
