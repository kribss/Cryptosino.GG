// SPDX-License-Identifier: MIT
//TO DO
//DONE just take 1% cut from final jackpot dispersal
//DONE give tickets based on .1 matic per ticket
//end ticket loop once winner is found

pragma solidity 0.6.6;

//import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

interface IUniswapV2Router02 {
    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

//swaps non-compatible link to oracle compatible link
interface IPegSwap {
    function swap(
        uint256 amount,
        address source,
        address target
    ) external;
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
}

//author => kribs.eth
contract JackpotGame is VRFConsumerBase {
    event NewJackpot(uint256 index, uint256 blockstamp);
    event PlayerJoin(uint256 bet, address player);
    event JackpotResult(address winner, uint256 jackpotSize);

    // chainlink vrf variables
    bytes32 internal keyHash;
    uint256 internal fee;

    //jackpot struct to organize each jackpot info
    struct Jackpot {
        uint256 index;
        uint256 size;
        uint256 blockstamp;
        uint256 jackpotEndTime;
        uint256 ticketIndex;
        address[] players;
        address payable winner;
    }

    // used to track game information
    uint256 index;
    address[] players;
    mapping(uint256 => Jackpot) jackpotIndex;
    Jackpot currentJackpot;
    uint256[] playerTicketArray;
    uint256 totalTickets;

    // used to determine whether a jackpot can be created/joined
    bool jackpotActive;

    address owner;

    mapping(uint256 => address) ticketToPlayer;
    mapping(address => uint256) playerBet;

    // Routers for automated link oracle payment
    IUniswapV2Router02 UNIQuickSwap = IUniswapV2Router02(
        0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff
    );
    IPegSwap PegSwap = IPegSwap(0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b);

    modifier onlyOwner() {
        require(msg.sender == owner, "Function only callable by owner");
        _;
    }

    receive() external payable {
        if (
            (msg.sender != address(UNIQuickSwap)) &&
            (msg.sender != address(PegSwap))
        ) {
            /* Donations welcomed :) */
            payable(owner).transfer(msg.value);
        }
    }

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Matic
     * Chainlink VRF Coordinator address: 0x3d2341ADb2D31f1c5530cDC622016af293177AE0
     * LINK token address:                0xb0897686c545045aFc77CF20eC7A532E3120E0F1
     * Key Hash: 0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da
     */

    constructor()
        public
        VRFConsumerBase(
            0x3d2341ADb2D31f1c5530cDC622016af293177AE0, // VRF Coordinator
            0xb0897686c545045aFc77CF20eC7A532E3120E0F1 // Link Token Address
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; //0.001 default link oracle fee
        index = 0;
        owner = msg.sender;
    }

    function newJackpot(uint256 _lengthInHours) public payable {
        require(jackpotActive == false, "Jackpot already active");
        require(_lengthInHours <= 24, "24 hour jackpot length max");
        jackpotActive = true;
        currentJackpot = Jackpot(
            index,
            msg.value,
            block.timestamp,
            block.timestamp + (_lengthInHours * 1 hours),
            0,
            players,
            address(this)
        );
        currentJackpot.players.push(msg.sender);
        playerBet[msg.sender] = msg.value;

        uint256 tickets = (msg.value / (10**18)) * 10;

        for (
            currentJackpot.ticketIndex;
            currentJackpot.ticketIndex < currentJackpot.ticketIndex + tickets;
            currentJackpot.ticketIndex++
        ) {
            ticketToPlayer[currentJackpot.ticketIndex] = msg.sender;
        }
        emit NewJackpot(index, block.timestamp);
    }

    function enterJackpot() public payable {
        require(jackpotActive == true, "no active jackpot to join");
        currentJackpot.players.push(msg.sender);
        currentJackpot.size += msg.value;
        playerBet[msg.sender] = msg.value;

        uint256 tickets = (msg.value / (10**18)) * 10;

        for (
            currentJackpot.ticketIndex;
            currentJackpot.ticketIndex < currentJackpot.ticketIndex + tickets;
            currentJackpot.ticketIndex++
        ) {
            ticketToPlayer[currentJackpot.ticketIndex] = msg.sender;
        }

        emit PlayerJoin(msg.value, msg.sender);

        if (now >= currentJackpot.jackpotEndTime) {
            getRandomNumber(currentJackpot.players.length);
        }
    }

    function pickWinner(uint256 randomness) internal {
        uint256 winningTicket = randomness % currentJackpot.ticketIndex;
        currentJackpot.winner = payable(ticketToPlayer[winningTicket]);
        currentJackpot.winner.transfer((currentJackpot.size * 99) / 100);
        jackpotActive = false;
        if (currentJackpot.index % 5 == 0) {
            payable(owner).transfer(address(this).balance);
        }
        Jackpot memory indexableJackpot = currentJackpot;
        jackpotIndex[index] = indexableJackpot;
        index++;
        emit JackpotResult(currentJackpot.winner, currentJackpot.size);
    }

    function ownerShipTransfer(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function getJackpotCount() external view returns (uint256) {
        return index + 1;
    }

    function getTicketOwner(uint256 ticketNumber)
        external
        view
        returns (address)
    {
        return ticketToPlayer[ticketNumber];
    }

    function timeLeftOnCurrentJackpot() external view returns (uint256) {
        return (currentJackpot.jackpotEndTime - now);
    }

    function getJackpotInfo(uint256 _i)
        external
        view
        returns (
            uint256 _index,
            uint256 _size,
            uint256 _blockstamp,
            uint256 _jackpotEndTime,
            uint256 _ticketIndex,
            address[] memory _players,
            address winner
        )
    {
        Jackpot memory jackpot = jackpotIndex[_i];
        return (
            _i,
            jackpot.size,
            jackpot.blockstamp,
            jackpot.jackpotEndTime,
            jackpot.ticketIndex,
            jackpot.players,
            jackpot.winner
        );
    }

    //CHAINLINK VRF FUNCTIONS BELOW
    function getRandomNumber(uint256 userProvidedSeed)
        internal
        returns (bytes32 requestId)
    {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK for VRF transaction"
        );
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        pickWinner(randomness);
    }
}

//PICK WINNER OLD CODE
//     for (uint256 i = 0; i <= totalTickets; i++) {
//         uint256[] memory playerArray = playerTickets[currentJackpot
//             .players[i]];
//         for (uint256 j = 0; j <= playerArray.length; j++) {
//             if (playerArray[j] == winningTicket) {
//                 currentJackpot.winner = payable(currentJackpot.players[i]);
//                 payable(currentJackpot.winner).transfer(
//                     (currentJackpot.size * 99) / 100
//                 );
//                 jackpotActive = false;
//                 if (currentJackpot.index % 5 == 0) {
//                     payable(owner).transfer(address(this).balance);
//                 }
//                 index++;
//                 emit JackpotResult(
//                     currentJackpot.winner,
//                     currentJackpot.size
//                 );
//             }
//         }
//     }
// }
//
// OLD METHOD OF TICKET GENERATION
// function generateTickets() internal {
//     uint256 j = 0;
//     totalTickets = 0;
//     for (uint256 i = 0; i <= currentJackpot.players.length; i++) {
//         uint256 percentOfPot = (playerBet[currentJackpot.players[i]] /
//             currentJackpot.size);

//         for (j; j <= percentOfPot; j++) {
//             playerTicketArray.push(j);
//         }
//         playerTickets[currentJackpot.players[i]] = playerTicketArray;

//         totalTickets += playerTicketArray.length;

//         delete playerTicketArray;
//     }
// }
