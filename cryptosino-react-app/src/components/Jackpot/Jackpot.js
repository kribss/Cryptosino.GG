import React, { useState, forwardRef, useImperativeHandle, Component } from 'react';
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { Button } from "../Button/Button";
import Web3 from "web3";
import "../Jackpot/Jackpot.css";
import "./Countdown"
import { ethers } from "ethers";
import Particles from 'react-particles-js';
import Timer from "./Timer";




class Jackpot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            size: 0,
            jackpot: null,
            players: [],
            account: null,
            signer: null,
            bet: null,
            timeLeft: 0,
            playerBets: null,
            betsArray: [],
            provider: null,
            jackpotStatus: "",
            feePercent: null,
            timerOn: false,
            timerStart: 10,
            timerTime: 10,
            balance: 0,
            winnings: 0,
            mostRecentSize: 0,
            mostRecentWinner: 0x000000,
            buttonText: "Create Jackpot"

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

        const JACKPOT_CONTRACT = "0x21487d16A8480dd92e4368aa1EDa782cF0c413b4";
        const JACKPOT_ABI = [
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
                        "internalType": "uint256",
                        "name": "_newJackpotLength",
                        "type": "uint256"
                    }
                ],
                "name": "changeJackpotLength",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
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
                "name": "enterJackpot",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "userProvidedSeed",
                        "type": "uint256"
                    }
                ],
                "name": "getRandomNumber",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "requestId",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "nonpayable",
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
                        "name": "winner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "jackpotSize",
                        "type": "uint256"
                    }
                ],
                "name": "JackpotResult",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "newJackpot",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
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
                        "internalType": "uint256",
                        "name": "blockstamp",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "size",
                        "type": "uint256"
                    }
                ],
                "name": "NewJackpot",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
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
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "time",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "jackpotSize",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "numOfPlayers",
                        "type": "uint256"
                    }
                ],
                "name": "PickingWinner",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "bet",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "size",
                        "type": "uint256"
                    }
                ],
                "name": "PlayerJoin",
                "type": "event"
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
                "inputs": [],
                "name": "withdrawWinnings",
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
                "name": "currentBetsArray",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "currentJackpotSize",
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
            },
            {
                "inputs": [],
                "name": "getCurrentJackpotInfo",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "_index",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_size",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_blockstamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_jackpotEndTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_ticketIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_winningTicket",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address[]",
                        "name": "_players",
                        "type": "address[]"
                    },
                    {
                        "internalType": "address",
                        "name": "winner",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getCurrentPlayers",
                "outputs": [
                    {
                        "internalType": "address[]",
                        "name": "",
                        "type": "address[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getJackpotCount",
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
                "name": "getJackpotStatus",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMostRecentWinner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "mostRecentWinner_",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMostRecentWinSize",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "mostRecentSize_",
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
                        "name": "_i",
                        "type": "uint256"
                    }
                ],
                "name": "getPriorJackpotInfo",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "_index",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_size",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_blockstamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_jackpotEndTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_ticketIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_winningTicket",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_randomNumberUsed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address[]",
                        "name": "_players",
                        "type": "address[]"
                    },
                    {
                        "internalType": "address",
                        "name": "winner",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "gameIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "ticketNumber",
                        "type": "uint256"
                    }
                ],
                "name": "getTicketOwner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "winner",
                        "type": "address"
                    }
                ],
                "name": "getWinnings",
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
                "name": "mostRecentSize",
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
                "name": "mostRecentWinner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "payoutPercent",
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
                "name": "payoutRecipient",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "playerBet",
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
                "name": "sendAmmount",
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
                "name": "timeLeftOnCurrentJackpot",
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
                "name": "winnings",
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
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "winningsOf",
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
        const JACKPOT = new ethers.Contract(
            JACKPOT_CONTRACT,
            JACKPOT_ABI,
            signer
        );


        this.setState({
            provider: provider,
            jackpot: JACKPOT,
            index: JSON.parse(await JACKPOT.getJackpotCount()),
            size: JSON.parse(await JACKPOT.currentJackpotSize()) / 10 ** 18,
            players: await JACKPOT.getCurrentPlayers(),
            betsArray: await JACKPOT.currentBetsArray(),
            jackpotStatus: await JACKPOT.getJackpotStatus(),
            feePercent: JSON.parse(await JACKPOT.feePercent()),
            balance: await web3.eth.getBalance(this.state.account),
            winnings: await JACKPOT.getWinnings(this.state.account),
            mostRecentSize: await JACKPOT.getMostRecentWinSize(),
            mostRecentWinner: await JACKPOT.getMostRecentWinner(),
            buttonText: "Create Jackpot",
            timeLeft: await JACKPOT.timeLeftOnCurrentJackpot()
        });

        if (this.state.jackpotStatus == "Inactive") {
            this.setState({ buttonText: "Create Jackpot" })
        } else if (this.state.jackpotStatus == "Picking Winner") {
            this.setState({ buttonText: "Currently Picking Winner" })
        } else {
            this.setState({ buttonText: "Join Jackpot" })
        }



    }



    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    handleChange = (event) => {
        this.setState({ bet: event.target.value });
    };



    render() {

        const Completionist = () => <span>Picking Winner Now!</span>;


        return (
            <div className="jackpot">
                {/* <Particles className="particles-js" params={{
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
                /> */}

                <Button
                    className="btns"
                    buttonStyle="btn--outline"
                    buttonSize="btn--medium"
                    path="/casino"
                >
                    Back To Games
                </Button>
                <div className="jackpot-container">
                    <br></br>
                    <div className='balance-indicator'>
                        <h1> Balance: {parseFloat((this.state.balance) / 10 ** 18).toFixed(2)} Matic</h1>
                        <h1> Winnings: {parseFloat((this.state.winnings) / 10 ** 18).toFixed(2)} Matic</h1>
                    </div>
                    <button className="withdraw-button"
                        onClick={async () => {
                            if (this.state.winnings == 0) {
                                window.alert("No winnings to withdraw");
                            } else {
                                const tx = await this.state.jackpot.withdrawWinnings();
                                console.log(tx.hash);
                            }
                        }
                        }

                    >Withdraw Winnings</button>
                    <h1 className="jackpot-header">Current Jackpot Size: {parseFloat(this.state.size).toFixed(2)} Matic </h1>



                    <br></br>
                    <br></br>

                    <br></br>

                    <Timer />


                    <br></br>
                    <input
                        className="jackpot-input"
                        type="number"
                        placeholder="Enter MATIC Bet > 1"
                        value={this.state.bet}
                        onChange={this.handleChange}
                    />

                    <button
                        id="joinbutton"
                        className="jackpot-join-button"
                        onClick={async () => {

                            if (this.state.jackpotStatus == "Active") {

                                const tx = await this.state.jackpot.enterJackpot({
                                    value: (this.state.bet * 10 ** 18).toString(), gasLimit: 9000000
                                });

                                console.log(tx.hash);
                                this.setState({ players: await this.state.jackpot.getCurrentPlayers() });
                                this.setState({ betsArray: await this.state.jackpot.currentBetsArray() });
                                this.setState({ size: JSON.parse(await this.state.jackpot.currentJackpotSize()) / 10 ** 18 });



                            } else if (this.state.jackpotStatus == "Inactive") {
                                const tx = await this.state.jackpot.newJackpot({
                                    value: (this.state.bet * 10 ** 18).toString(), gasLimit: 9000000
                                });
                                console.log(tx.hash);

                                this.setState({ players: await this.state.jackpot.getCurrentPlayers() });
                                this.setState({ betsArray: await this.state.jackpot.currentBetsArray() });
                                this.setState({ size: JSON.parse(await this.state.jackpot.currentJackpotSize()) / 10 ** 18 });
                                this.setState({ jackpotStatus: await this.state.jackpot.getJackpotStatus() })
                            }
                            else if (this.state.jackpotStatus == "Picking Winner") {
                                this.setState({ size: 0 });
                                window.alert("Winner being picked now, wait to join/create next jackpot!");

                            }
                        }}

                    >
                        {this.state.buttonText}
                    </button>
                    <br></br>
                    <p className="fee-announce">*{this.state.feePercent}% Fee Taken*</p>
                    <br></br>
                    <div className="most-recent-info">
                        <p> Congratulations {(this.state.mostRecentWinner).toString().substr(0, 7) + "\u2026"} on the most recent {parseFloat((this.state.mostRecentSize) / 10 ** 18).toFixed(2)} MATIC win!</p>
                    </div>
                    <br></br>
                    <h3 className="current-jackpot-bets">Current Players: <br></br>
                        <ul className="players"> {this.state.players.map((player) => (<li key={player}> {player} Bet &nbsp;</li>))}</ul>
                        <ul className="bets"> {this.state.betsArray.map((bet) => (<li key={bet}> {JSON.parse(bet) / 10 ** 18} Matic </li>))}</ul>

                    </h3>
                    <div className="game-footer">
                        <ul>
                            <li>
                                <a href="https://github.com/kribss/Cryptosino.GG/blob/master/cryptosino-solidity/contracts/Jackpot.sol" target="_blank">Github</a>
                            </li>
                            <li>
                                <a color="white" href="https://explorer-mainnet.maticvigil.com/address/0x21487d16A8480dd92e4368aa1EDa782cF0c413b4/transactions" target="_blank">
                                    Matic Explorer
              </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div >
        )
    }
}
export default Jackpot

