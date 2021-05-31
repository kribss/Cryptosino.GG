import React from "react";
import Web3 from "web3";
import { Button } from "../Button/Button";
import CasinoCardItem from "./CasinoCardItem";
import "./CasinoCards.css";
import Particles from 'react-particles-js';


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
      <div className="particles-matic">
        <Particles className="particles-js" params={{
          "particles": {
            "number": {
              "value": 80,
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": "#ffffff"
            },
            "shape": {
              "type": "image",
              "stroke": {
                "width": 0,
                "color": "#000000"
              },
              "polygon": {
                "nb_sides": 5
              },
              "image": {
                "src": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcrypto.com%2Fprice%2Fcoin-data%2Ficon%2FMATIC%2Fcolor_icon.png&f=1&nofb=1",
                "width": 100,
                "height": 100
              }
            },
            "opacity": {
              "value": 0.5,
              "random": false,
              "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
              }
            },
            "size": {
              "value": 31.565905665290902,
              "random": true,
              "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
              }
            },
            "line_linked": {
              "enable": false,
              "distance": 150,
              "color": "#ffffff",
              "opacity": 0.4,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 1.5,
              "direction": "none",
              "random": false,
              "straight": false,
              "out_mode": "out",
              "bounce": false,
              "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "repulse"
              },
              "onclick": {
                "enable": true,
                "mode": "push"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 400,
                "line_linked": {
                  "opacity": 1
                }
              },
              "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
              },
              "repulse": {
                "distance": 200,
                "duration": 0.4
              },
              "push": {
                "particles_nb": 4
              },
              "remove": {
                "particles_nb": 2
              }
            }
          },
          "retina_detect": true
        }}
        />
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--medium"
          path="/"
        >
          Back To Home
        </Button>
        <div className="casinocards">
          <div className="casinocards__container">
            <h1 className="games">G a m e s</h1>
            <div className="casinocards__wrapper">
              <ul className="casinocards__items">
                <CasinoCardItem
                  src="Images/BLACKlinkdiceSMALL.jpg"
                  text="Dice"
                  label="COMING SOON"
                />
                <CasinoCardItem
                  src="Images/jackpotSMALL.jpg"
                  text="Jackpot"
                  label="PLAY NOW"
                  path="jackpot"
                />
                <CasinoCardItem
                  src="Images/SPINNINGGIF.gif"
                  text="Coin Flip"
                  label="PLAY NOW"
                  path="coinflip"
                />

              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CasinoCards;
