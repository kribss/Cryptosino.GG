import React, { useState } from "react";
import Web3 from "web3";
import "../Coinflip/Coinflip.css";
import Game from "../Game/Game.js";
import { ethers } from "ethers";

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
      <div className="coinflip">
        <img alt="landing page background" src="./Images/BlankBackground.jpg"></img>
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
        <p>*1% House Fee Taken On All Coinflips*</p>
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
    );
  }
}

export default Coinflip;