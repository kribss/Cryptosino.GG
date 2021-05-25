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

//         const JACKPOT_CONTRACT = "0x08B4c25ca730A449BD1A01D96380608e97124098";
//         const JACKPOT_ABI = [
//             "function get_game_count() external view returns(uint256)",
//             "function create_game() public payable",
//             "function join_game(uint256 _index) external payable",
//             "function get_game_info(uint256 _index) external view returns(uint256 _i, address _player1, address _player2, uint256 _amount, address _winner, uint256 _timestamp)",
//         ];

//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const COINFLIP = new ethers.Contract(
//             COINFLIP_CONTRACT,
//             COINFLIP_ABI,
//             signer
//         );

//         this.setState({
//             provider: provider,
//             coinflip: COINFLIP,
//             index: JSON.parse(await COINFLIP.get_game_count()),
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
//             <div className="coinflip">
//                 <img alt="landing page background" src="./Images/BlankBackground.jpg"></img>
//                 <h3 className="coinflip-header">Total Games: {this.state.index}</h3>
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
