import React from "react";
import Web3 from "web3";
import CasinoCardItem from "./CasinoCardItem";
import "./CasinoCards.css";

class CasinoCards extends React.Component {
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Please switch to an Ethereum compatable browser with Metamask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    //Network ID
    const networkId = await web3.eth.net.getId();
    if (networkId != 137) {
      window.alert("Please switch to Polygon Mainnet!");
    }
  }
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  render() {
    return (
      <div className="casinocards">
        <div className="casinocards__container">
          <img
            className="casinocards__background"
            src="Images/BlankBackground.jpg"
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
}
export default CasinoCards;
