// SPDX-License-Identifier: NONE

pragma solidity 0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

//import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/VRFConsumerBase.sol";

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
    event NewJackpot(uint256 index, uint256 blockstamp, uint256 size);
    event PlayerJoin(uint256 bet, address player, uint256 size);
    event JackpotResult(address winner, uint256 jackpotSize);
    event PickingWinner(
        uint256 time,
        uint256 jackpotSize,
        uint256 numOfPlayers
    );

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
        uint256 randomNumberUsed;
        uint256 winningTicket;
        address[] players;
        uint256[] bets;
        address payable winner;
    }

    // used to track game information

    Jackpot currentJackpot;

    uint256[] playerTicketArray;
    address[] players;

    uint256[] bets;
    uint256 index;
    uint256 totalTickets;
    uint256 jackpotLength;
    enum jackpotStatus {Active, Inactive, PickingWinner}
    jackpotStatus currentJackpotStatus;
    address payable public owner;
    address payable public payoutRecipient;
    uint256 public feePercent;
    uint256 public payoutPercent;
    uint256 public sendAmmount;
    uint256 public winnings;

    mapping(address => uint256) public playerBet;
    mapping(uint256 => Jackpot) jackpotIndex;
    mapping(bytes32 => Jackpot) requestIndex;
    mapping(uint256 => mapping(uint256 => address)) ticketToPlayerMASTER;
    mapping(address => uint256) public winningsOf;

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

    //  Network: Matic Mumbai Testnet
    //  LINK Token:	        0x326C977E6efc84E512bB9C30f76E30c160eD06FB
    //  VRF Coordinator:	0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
    //  Key Hash:	        0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
    //  Fee:	            0.0001 LINK

    //   Network: Matic
    //   VRF Coordinator:    0x3d2341ADb2D31f1c5530cDC622016af293177AE0
    //   LINK token address: 0xb0897686c545045aFc77CF20eC7A532E3120E0F1
    //   Key Hash:           0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da
    //   Fee:                0.0001 LINK

    constructor()
        public
        VRFConsumerBase(
            0x3d2341ADb2D31f1c5530cDC622016af293177AE0, // VRF Coordinator
            0xb0897686c545045aFc77CF20eC7A532E3120E0F1 // Link Token Address
        )
    {
        currentJackpotStatus = jackpotStatus.Inactive;
        keyHash = 0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da;
        fee = 0.0001 * 10**18;
        index = 0;
        owner = msg.sender;
        payoutRecipient = msg.sender;
        jackpotLength = 10;
        feePercent = 1;
        payoutPercent = 99;
    }

    function newJackpot() public payable {
        require(
            currentJackpotStatus == jackpotStatus.Inactive,
            "Jackpot already active"
        );
        require((msg.value % 10**18) == 0, "whole number bets only");
        require(msg.value >= 10**18, "bets greater than 1 only");
        jackpotIndex[index] = currentJackpot;
        index++;
        currentJackpotStatus = jackpotStatus.Active;
        currentJackpot = Jackpot(
            index,
            msg.value,
            block.timestamp,
            block.timestamp + (jackpotLength * 1 minutes),
            0,
            0,
            0,
            players,
            bets,
            address(this)
        );
        currentJackpot.players.push(msg.sender);
        currentJackpot.bets.push(msg.value);

        playerBet[msg.sender] = msg.value;

        uint256 startingTicket = currentJackpot.ticketIndex;

        uint256 tickets = msg.value / (10**18);

        for (
            currentJackpot.ticketIndex;
            currentJackpot.ticketIndex < startingTicket + tickets;
            currentJackpot.ticketIndex++
        ) {
            ticketToPlayerMASTER[index][currentJackpot.ticketIndex] = msg
                .sender;
        }
        emit NewJackpot(index, block.timestamp, currentJackpot.size);
    }

    function enterJackpot() public payable {
        require(
            currentJackpotStatus == jackpotStatus.Active,
            "no active jackpot to join"
        );
        require((msg.value % 10**18) == 0, "whole number bets only");
        require(msg.value >= 10**18, "bets greater than 1 only");
        currentJackpot.players.push(msg.sender);
        currentJackpot.bets.push(msg.value);
        currentJackpot.size += msg.value;
        playerBet[msg.sender] = msg.value;

        uint256 startingTicket = currentJackpot.ticketIndex;
        uint256 tickets = msg.value / (10**18);

        for (
            currentJackpot.ticketIndex;
            currentJackpot.ticketIndex < startingTicket + tickets;
            currentJackpot.ticketIndex++
        ) {
            ticketToPlayerMASTER[index][currentJackpot.ticketIndex] = msg
                .sender;
        }
        emit PlayerJoin(msg.value, msg.sender, currentJackpot.size);

        if (now >= currentJackpot.jackpotEndTime) {
            currentJackpotStatus = jackpotStatus.Inactive;

            emit PickingWinner(
                block.timestamp,
                currentJackpot.size,
                currentJackpot.players.length
            );

            address[] memory path = get_path();

            /*Convert bets. MATIC => WETH => LINK (ERC-20) => LINK (ERC-621) */
            uint256 amountIn = UNIQuickSwap.getAmountsIn(fee, path)[0];
            UNIQuickSwap.swapETHForExactTokens{value: amountIn}(
                fee,
                path,
                address(this),
                block.timestamp + 15
            );
            IERC20(0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39).approve(
                address(PegSwap),
                fee
            );
            PegSwap.swap(
                fee,
                0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39,
                address(LINK)
            );

            currentJackpot.size -= amountIn;

            getRandomNumber(block.timestamp);
        }
    }

    function withdrawWinnings() public {
        address payable winner = msg.sender;
        winnings = winningsOf[msg.sender];
        winner.transfer(winnings);
        winningsOf[msg.sender] = 0;
    }

    function ownerShipTransfer(address payable _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function getJackpotCount() external view returns (uint256) {
        return index;
    }

    function getTicketOwner(uint256 gameIndex, uint256 ticketNumber)
        external
        view
        returns (address)
    {
        return ticketToPlayerMASTER[gameIndex][ticketNumber];
    }

    function changePayoutRecipient(address payable newRecipient)
        public
        onlyOwner
    {
        payoutRecipient = newRecipient;
    }

    function changeJackpotLength(uint256 _newJackpotLength) public onlyOwner {
        jackpotLength = _newJackpotLength;
    }

    function timeLeftOnCurrentJackpot() external view returns (uint256) {
        if (now > currentJackpot.jackpotEndTime) {
            uint256 zero = 0;
            return (zero);
        } else {
            return (currentJackpot.jackpotEndTime - now);
        }
    }

    function getCurrentJackpotInfo()
        public
        view
        returns (
            uint256 _index,
            uint256 _size,
            uint256 _blockstamp,
            uint256 _jackpotEndTime,
            uint256 _ticketIndex,
            uint256 _winningTicket,
            address[] memory _players,
            address winner
        )
    {
        return (
            currentJackpot.index,
            currentJackpot.size,
            currentJackpot.blockstamp,
            currentJackpot.jackpotEndTime,
            currentJackpot.ticketIndex,
            currentJackpot.winningTicket,
            currentJackpot.players,
            currentJackpot.winner
        );
    }

    function currentJackpotSize() public view returns (uint256) {
        if (currentJackpotStatus == jackpotStatus.Inactive) {
            return 0;
        } else {
            return currentJackpot.size;
        }
    }

    function getPriorJackpotInfo(uint256 _i)
        external
        view
        returns (
            uint256 _index,
            uint256 _size,
            uint256 _blockstamp,
            uint256 _jackpotEndTime,
            uint256 _ticketIndex,
            uint256 _winningTicket,
            uint256 _randomNumberUsed,
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
            jackpot.winningTicket,
            jackpot.randomNumberUsed,
            jackpot.players,
            jackpot.winner
        );
    }

    function getCurrentPlayers() public view returns (address[] memory) {
        if (currentJackpotStatus == jackpotStatus.Inactive) {
            return players;
        } else {
            return currentJackpot.players;
        }
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getPlayerBet(address _player) public view returns (uint256) {
        return (playerBet[_player] / 10**18);
    }

    function currentBetsArray() public view returns (uint256[] memory) {
        if (currentJackpotStatus == jackpotStatus.Inactive) {
            return bets;
        } else {
            return currentJackpot.bets;
        }
    }

    function getJackpotStatus() external view returns (string memory) {
        if (currentJackpotStatus == jackpotStatus.Active) {
            return "Active";
        }
        if (currentJackpotStatus == jackpotStatus.Inactive) {
            return "Inactive";
        }
        if (currentJackpotStatus == jackpotStatus.PickingWinner) {
            return "Picking Winner";
        }
    }

    function changeFeePercent(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 5, "new fee cannot be more than 5%");
        feePercent = newFeePercent;
        payoutPercent = 100 - newFeePercent;
    }

    function withdrawHouseFunds() public onlyOwner {
        require(
            currentJackpotStatus == jackpotStatus.Inactive,
            "cannot withdraw funds while jackpot is active"
        );
        payoutRecipient.transfer(address(this).balance);
    }

    function getWinnings(address winner) public view returns (uint256) {
        return winningsOf[winner];
    }

    //CHAINLINK VRF FUNCTIONS BELOW

    function get_path() internal pure returns (address[] memory _path) {
        address[] memory path = new address[](3);
        path[0] = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270; //WMatic
        path[1] = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619; //WETH
        path[2] = 0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39; //LINK
        return path;
    }

    function getRandomNumber(uint256 userProvidedSeed)
        public
        returns (bytes32 requestId)
    {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        require(
            now >= currentJackpot.jackpotEndTime,
            "cannot requestRandomness while jackpot active"
        );
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        currentJackpot.winningTicket = randomness % currentJackpot.ticketIndex;
        currentJackpot.winner = payable(
            ticketToPlayerMASTER[currentJackpot.index][currentJackpot
                .winningTicket]
        );
        winningsOf[payoutRecipient] += ((currentJackpot.size * feePercent) /
            100);
        winningsOf[currentJackpot.winner] += ((currentJackpot.size *
            payoutPercent) / 100);
        currentJackpotStatus = jackpotStatus.Inactive;
    }
}
