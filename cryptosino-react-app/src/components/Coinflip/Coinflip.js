import React, { useState } from "react";
import Web3 from "web3";
import { Button } from "../Button/Button";
import "../Coinflip/Coinflip.css";
import Game from "../Game/Game.js";
import { ethers } from "ethers";
import Particles from 'react-particles-js';


class Coinflip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      coinflip: null,
      list: [],
      account: null,
      signer: null,
      bet: null,
      provider: null,
      feePercent: null,
    };
  }

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

    const COINFLIP_CONTRACT = "0xbC3edBCde35A0994EC8704261A0Ac94Fe7eB0624";
    const COINFLIP_ABI = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "newFeePercent",
            "type": "uint256"
          }
        ],
        "name": "changeFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newRecipient",
            "type": "address"
          }
        ],
        "name": "changePayoutRecipient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "create_game",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "GameCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "player",
            "type": "address"
          }
        ],
        "name": "GameJoined",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "winner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "GameResult",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_index",
            "type": "uint256"
          }
        ],
        "name": "join_game",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "ownerShipTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "requestId",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "randomness",
            "type": "uint256"
          }
        ],
        "name": "rawFulfillRandomness",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      },
      {
        "inputs": [],
        "name": "feePercent",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "get_game_count",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_index",
            "type": "uint256"
          }
        ],
        "name": "get_game_info",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "_i",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_player1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_player2",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_winner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_timestamp",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const COINFLIP = new ethers.Contract(
      COINFLIP_CONTRACT,
      COINFLIP_ABI,
      signer
    );

    this.setState({
      provider: provider,
      coinflip: COINFLIP,
      index: JSON.parse(await COINFLIP.get_game_count()),
      feePercent: JSON.parse(await COINFLIP.feePercent())
    });
    this.setState({
      list: Array.from(Array(this.state.index).keys()).reverse(),
    });
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  handleChange = (event) => {
    this.setState({ bet: event.target.value });
  };

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
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--medium"
          path="/casino"
        >
          Back To Games
        </Button>
        <div className="coinflip">
          <h3 className="coinflip-header">Total Games: {this.state.index}</h3>
          <input
            className="coinflip-create-input"
            type="number"
            placeholder="Enter MATIC Bet > 1"
            value={this.state.bet}
            onChange={this.handleChange}
          />
          <button
            className="coinflip-create-button"
            onClick={async () => {
              const tx = await this.state.coinflip.create_game({
                value: (this.state.bet * 10 ** 18).toString(),
              });
              console.log(tx.hash);
            }}
          >
            Create Game
        </button>
          <br></br>
          <p className="fee-announce">*{this.state.feePercent}% Fee Taken to Support Cryptosino*</p>
          <ul>
            {this.state.list.map((index) => (
              <li key={index}>
                <Game
                  index={index}
                  contract={this.state.coinflip}
                  account={this.state.account}
                />
              </li>
            ))}
          </ul>
          <div className="game-footer">
            <ul>
              <li>
                <a href="https://github.com/kribss/Cryptosino.GG/blob/master/cryptosino-solidity/contracts/Coinflip.sol" target="_blank">Github</a>
              </li>
              <li>
                <a href="https://explorer-mainnet.maticvigil.com/address/0xbC3edBCde35A0994EC8704261A0Ac94Fe7eB0624" target="_blank">
                  Matic Explorer
              </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Coinflip;