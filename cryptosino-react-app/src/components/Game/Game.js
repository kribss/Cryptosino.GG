import React, { Component, useState } from "react";
import "./Game.css";
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: null,
      player2: null,
      amount: 0,
      winner: null,
      timestamp: 0,
      buttonDisplay: "Game finished",
    };
  }

  async componentDidMount() {
    const data = await this.props.contract.get_game_info(this.props.index);
    this.setState({
      player1: data[1],
      player2: data[2],
      amount: data[3],
      winner: data[4],
      timestamp: JSON.parse(data[5]),
    });
    if (this.state.winner == this.props.contract.address) {
      this.setState({ winner: null });
    }
    if (this.state.player2 == this.props.contract.address) {
      this.setState({ player2: null });
      this.setState({ buttonDisplay: "Join Game" });
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-info">
          <p>
            <code>{JSON.parse(this.state.amount) / 10 ** 18} MATIC </code>
          </p>
          <button
            onClick={async () => {
              if (this.state.buttonDisplay == "Join Game") {
                try {
                  console.log(this.props.index);
                  console.log(JSON.parse(this.state.amount));
                  this.props.contract.join_game(this.props.index, {
                    value: this.state.amount,
                    gasLimit: 4500000,
                  });
                } catch (err) {
                  window.alert("invalid bet!");
                }
              }
            }}
          >
            {this.state.buttonDisplay}
          </button>
          <p>
            <b>Player 1:</b> <code>{this.state.player1}</code>
          </p>
          <p>
            <b>Player 2:</b> <code>{this.state.player2}</code>
          </p>
          <p>
            <b>block created:</b> <code>{this.state.timestamp}</code>
          </p>
        </div>
        <h className="winner-announce">
          Winner:{" "}
          <code>
            <b>{this.state.winner}</b>
          </code>
        </h>
      </div>
    );
  }
}

export default Game;
