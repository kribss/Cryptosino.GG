// import React, { Component, useState } from "react";
// import Web3 from "web3";
// import "../Coinflip/Coinflip.css";
// import Game from "../Game/Game.js";
// import { ethers } from "ethers";

// class Jackpot extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             index: 0,
//             coinflip: null,
//             list: [],
//             account: null,
//             signer: null,
//             bet: 0,
//             provider: null,
//         };
//     }

//     async loadWeb3() {
//         if (window.ethereum) {
//             window.web3 = new Web3(window.ethereum);
//             await window.ethereum.enable();
//         } else if (window.web3) {
//             window.web3 = new Web3(window.web3.currentProvider);
//         } else {
//             window.alert(
//                 "Please switch to an Ethereum compatable browser with Metamask!"
//             );
//         }
//     }

//     async loadBlockchainData() {
//         const web3 = window.web3;
//         const accounts = await web3.eth.getAccounts();
//         this.setState({ account: accounts[0] });

//         //Network ID
//         const networkId = await web3.eth.net.getId();
//         if (networkId != 137) {
//             window.alert("Please switch to Polygon Mainnet!");
//         }

//         const JACKPOT_CONTRACT = "0x8E7059761d25465046d4A8CbbC53c63E5Ac7C418";
//         const JACKPOT_ABI = [
//             {
//                 "inputs": [],
//                 "stateMutability": "nonpayable",
//                 "type": "constructor"
//             },
//             {
//                 "anonymous": false,
//                 "inputs": [
//                     {
//                         "indexed": false,
//                         "internalType": "address",
//                         "name": "winner",
//                         "type": "address"
//                     },
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "jackpotSize",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "JackpotResult",
//                 "type": "event"
//             },
//             {
//                 "anonymous": false,
//                 "inputs": [
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "index",
//                         "type": "uint256"
//                     },
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "blockstamp",
//                         "type": "uint256"
//                     },
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "size",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "NewJackpot",
//                 "type": "event"
//             },
//             {
//                 "anonymous": false,
//                 "inputs": [
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "time",
//                         "type": "uint256"
//                     },
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "jackpotSize",
//                         "type": "uint256"
//                     },
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "numOfPlayers",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "PickingWinner",
//                 "type": "event"
//             },
//             {
//                 "anonymous": false,
//                 "inputs": [
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "bet",
//                         "type": "uint256"
//                     },
//                     {
//                         "indexed": false,
//                         "internalType": "address",
//                         "name": "player",
//                         "type": "address"
//                     },
//                     {
//                         "indexed": false,
//                         "internalType": "uint256",
//                         "name": "size",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "PlayerJoin",
//                 "type": "event"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "newFeePercent",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "changeFeePercent",
//                 "outputs": [],
//                 "stateMutability": "nonpayable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "_newMaxLength",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "changeMaxLength",
//                 "outputs": [],
//                 "stateMutability": "nonpayable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "address",
//                         "name": "newRecipient",
//                         "type": "address"
//                     }
//                 ],
//                 "name": "changePayoutRecipient",
//                 "outputs": [],
//                 "stateMutability": "nonpayable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "enterJackpot",
//                 "outputs": [],
//                 "stateMutability": "payable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "feePercent",
//                 "outputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "",
//                         "type": "uint256"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "getContractBalance",
//                 "outputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "",
//                         "type": "uint256"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "getCurrentJackpotInfo",
//                 "outputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "_index",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_size",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_blockstamp",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_jackpotEndTime",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_ticketIndex",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "address[]",
//                         "name": "_players",
//                         "type": "address[]"
//                     },
//                     {
//                         "internalType": "address",
//                         "name": "winner",
//                         "type": "address"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "getJackpotCount",
//                 "outputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "",
//                         "type": "uint256"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "getJackpotStatus",
//                 "outputs": [
//                     {
//                         "internalType": "string",
//                         "name": "",
//                         "type": "string"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "_i",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "getPriorJackpotInfo",
//                 "outputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "_index",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_size",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_blockstamp",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_jackpotEndTime",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_ticketIndex",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "_randomNumberUsed",
//                         "type": "uint256"
//                     },
//                     {
//                         "internalType": "address[]",
//                         "name": "_players",
//                         "type": "address[]"
//                     },
//                     {
//                         "internalType": "address",
//                         "name": "winner",
//                         "type": "address"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "userProvidedSeed",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "getRandomNumber",
//                 "outputs": [
//                     {
//                         "internalType": "bytes32",
//                         "name": "requestId",
//                         "type": "bytes32"
//                     }
//                 ],
//                 "stateMutability": "nonpayable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "ticketNumber",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "getTicketOwner",
//                 "outputs": [
//                     {
//                         "internalType": "address",
//                         "name": "",
//                         "type": "address"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "timeInMinutes",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "newJackpot",
//                 "outputs": [],
//                 "stateMutability": "payable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "owner",
//                 "outputs": [
//                     {
//                         "internalType": "address",
//                         "name": "",
//                         "type": "address"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "address",
//                         "name": "_newOwner",
//                         "type": "address"
//                     }
//                 ],
//                 "name": "ownerShipTransfer",
//                 "outputs": [],
//                 "stateMutability": "nonpayable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "payoutRecipient",
//                 "outputs": [
//                     {
//                         "internalType": "address",
//                         "name": "",
//                         "type": "address"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [
//                     {
//                         "internalType": "bytes32",
//                         "name": "requestId",
//                         "type": "bytes32"
//                     },
//                     {
//                         "internalType": "uint256",
//                         "name": "randomness",
//                         "type": "uint256"
//                     }
//                 ],
//                 "name": "rawFulfillRandomness",
//                 "outputs": [],
//                 "stateMutability": "nonpayable",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "sendAmmount",
//                 "outputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "",
//                         "type": "uint256"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "inputs": [],
//                 "name": "timeLeftOnCurrentJackpot",
//                 "outputs": [
//                     {
//                         "internalType": "uint256",
//                         "name": "",
//                         "type": "uint256"
//                     }
//                 ],
//                 "stateMutability": "view",
//                 "type": "function"
//             },
//             {
//                 "stateMutability": "payable",
//                 "type": "receive"
//             }
//         ];

//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const JACKPOT = new ethers.Contract(
//             JACKPOT_CONTRACT,
//             JACKPOT_ABI,
//             signer
//         );

//         this.setState({
//             provider: provider,
//             jackpot: JACKPOT,
//             index: JSON.parse(await JACKPOT.getJackpotCount()),
//         });
//         this.setState({
//             list: Array.from(Array(this.state.index).keys()).reverse(),
//         });
//     }

//     async componentDidMount() {
//         await this.loadWeb3();
//         await this.loadBlockchainData();
//     }

//     handleChange = (event) => {
//         this.setState({ bet: event.target.value });
//     };

//     render() {
//         return (
//             <div className="jackpot">
//                 <img alt="landing page background" src="./Images/BlankBackground.jpg"></img>
//                 <h3 className="jackpot-header">Current Jackpot Size: {this.state.index}</h3>
//                 <input
//                     type="number"
//                     placeholder="MATIC"
//                     value={this.state.bet}
//                     onChange={this.handleChange}
//                 />
//                 <button
//                     onClick={async () => {
//                         const tx = await this.state.coinflip.create_game({
//                             value: (this.state.bet * 10 ** 18).toString(),
//                         });
//                         console.log(tx.hash);
//                     }}
//                 >
//                     Create Game
//         </button>
//                 <ul>
//                     {this.state.list.map((index) => (
//                         <li key={index}>
//                             <Game
//                                 index={index}
//                                 contract={this.state.coinflip}
//                                 account={this.state.account}
//                             />
//                         </li>
//                     ))}
//                 </ul>
//                 <div className="game-footer">
//                     <ul>
//                         <li>
//                             <a href="https://github.com/kribss/Cryptosino.GG/blob/master/cryptosino-solidity/contracts/Coinflip.sol" target="_blank">Github</a>
//                         </li>
//                         <li>
//                             <a href="https://explorer-mainnet.maticvigil.com/address/0x08B4c25ca730A449BD1A01D96380608e97124098/transactions" target="_blank">
//                                 Matic Explorer
//               </a>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Jackpot;
