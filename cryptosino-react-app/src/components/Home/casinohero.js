import React from "react";
import { Button } from "../Button/Button";
import "./casinohero.css";
import "./particles.css";
import "./logo.css";
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
                "src": "https://i.imgur.com/hVDyEsm.png",
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
          <p class="logo-1">cryptosino.gg</p>
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

        </div>
        <div className="about-btns">
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={() => {
              window.open('https://github.com/kribss/Cryptosino.GG');
            }}
          >
            Github
            </Button>
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={() => {
              window.open('https://cryptosinogg.medium.com/cryptosino-gg-decentralized-gambling-118a3b990793');
            }}
          >
            Medium
          </Button>
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={() => {
              window.open('https://twitter.com/CryptosinoGG');
            }}

          >
            Twitter
          </Button>
        </div>

      </div>
    );
  }
}
export default CasinoHero;
