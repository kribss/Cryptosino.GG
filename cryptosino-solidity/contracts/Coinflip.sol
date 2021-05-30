// SPDX-License-Identifier: NONE

//deployed at 0xeEc30f1541097fBFf9B82B363A42bD11700C72e7

pragma solidity 0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

//import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/VRFConsumerBase.sol";

interface Router {
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

contract Coinflip is VRFConsumerBase {
    event GameCreated(address player, uint256 amount);
    event GameJoined(uint256 index, address player);
    event GameResult(uint256 index, address winner, uint256 amount);

    /*Chainlink VRF Variables*/
    bytes32 internal keyHash;
    uint256 internal fee;

    /*Game information and variables*/
    struct Game {
        uint256 index;
        address player1;
        address player2;
        uint256 amount;
        address winner;
        uint256 blockstamp;
    }

    uint256 public feePercent;

    uint256 sendAmmount;

    address payoutRecipient;

    modifier onlyOwner() {
        require(msg.sender == owner, "Function only callable by owner");
        _;
    }
    //Game info vars/mappings
    uint256 index;
    mapping(uint256 => Game) gameIndex;
    mapping(bytes32 => Game) requestIndex;

    Router QuickSwap = Router(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    IPegSwap PegSwap = IPegSwap(0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b);

    receive() external payable {
        if (
            msg.sender != address(QuickSwap) && msg.sender != address(PegSwap)
        ) {
            /* Donations welcomed :) */
            payable(owner).transfer(msg.value);
        }
    }

    address owner;

    constructor()
        public
        VRFConsumerBase(
            0x3d2341ADb2D31f1c5530cDC622016af293177AE0, // VRF Coordinator
            0xb0897686c545045aFc77CF20eC7A532E3120E0F1 // LINK Token
        )
    {
        keyHash = 0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da;
        fee = 0.0001 * 10**18; // 0.0001 LINK
        index = 0;
        owner = msg.sender;
        payoutRecipient = 0x94e5149AC7B8B1249069f6D9DFCBb2590d641dDC;
        feePercent = 2;
    }

    //Game Functions
    function create_game() public payable {
        Game memory newGame = Game(
            index,
            msg.sender,
            address(this),
            msg.value,
            address(this),
            block.timestamp
        );
        gameIndex[index] = newGame;
        index++;
        emit GameCreated(msg.sender, msg.value);
    }

    function join_game(uint256 _index) external payable {
        Game memory game = gameIndex[_index];
        address[] memory path = get_path();

        require(msg.value == game.amount, "Invalid bet!");
        require(game.player2 == address(this), "Game already joined");
        require(game.winner == address(this), "Game already played");

        /*Convert bets. MATIC => WETH => LINK (ERC-20) => LINK (ERC-621) */
        uint256 amountIn = QuickSwap.getAmountsIn(fee, path)[0];
        QuickSwap.swapETHForExactTokens{value: amountIn}(
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

        /*update game values*/
        game.player2 = msg.sender;
        game.amount += msg.value - amountIn;
        gameIndex[_index] = game;

        /*submit randomness request*/
        bytes32 requestId = requestRandomness(keyHash, fee, block.timestamp);
        requestIndex[requestId] = game;

        emit GameJoined(_index, msg.sender);
    }

    //getter/helper functions

    function changePayoutRecipient(address newRecipient) public onlyOwner {
        payoutRecipient = newRecipient;
    }

    function ownerShipTransfer(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function changeFeePercent(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 5, "new fee cannot be more than 5%");
        feePercent = newFeePercent;
    }

    function get_game_count() external view returns (uint256) {
        return index;
    }

    function get_game_info(uint256 _index)
        external
        view
        returns (
            uint256 _i,
            address _player1,
            address _player2,
            uint256 _amount,
            address _winner,
            uint256 _timestamp
        )
    {
        Game memory game = gameIndex[_index];
        return (
            _index,
            game.player1,
            game.player2,
            game.amount,
            game.winner,
            game.blockstamp
        );
    }

    //Chainlink VRF Functions/Helpers

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        Game memory game = requestIndex[requestId];
        if (randomness % 2 == 0) {
            game.winner = game.player1;
        } else {
            game.winner = game.player2;
        }
        uint256 payoutPercent = 100 - feePercent;
        gameIndex[game.index] = game;
        uint256 winnings = ((game.amount * payoutPercent) / 100);
        uint256 houseFee = ((game.amount * feePercent) / 100);
        payable(payoutRecipient).transfer(houseFee);
        payable(game.winner).transfer(winnings);

        emit GameResult(game.index, game.winner, game.amount);
    }

    function get_path() internal pure returns (address[] memory _path) {
        address[] memory path = new address[](3);
        path[0] = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270; //WMatic
        path[1] = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619; //WETH
        path[2] = 0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39; //LINK
        return path;
    }
}
