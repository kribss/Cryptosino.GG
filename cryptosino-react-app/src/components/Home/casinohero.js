import React from "react";
import Web3 from "web3";
import { Button } from "../Button/Button";
import "./casinohero.css";
import "./particles.css";
import Particles from 'react-particles-js';

class CasinoHero extends React.Component {

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
        <div className="casinohero-container">
          {/* <img src="/Images/bg_text_up.jpg" autoPlay loop muted /> */}
          <h1 className="logo">Cryptosino.GG</h1>
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
            <p>The CryptoSino was started as an alternative to the typical centralized casino. CryptoSino is built upon the Ethereum Virtual Machine and secured using Chainlinks VRF. Furthermore, CryptoSino is entirely open source and can be viewed using the Github link below. Enjoy!</p>
            <a href="https://github.com/kribss/Cryptosino.GG" target="_blank">Github</a>
          </div>
        </div>
      </div>
    );
  }
}
export default CasinoHero;
