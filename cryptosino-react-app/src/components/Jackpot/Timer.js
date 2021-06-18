import React from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./Timer.css";

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <div className="timer">Picking Winner!</div>;
    }

    return (
        <div className="timer">
            <div className="text">Remaining</div>
            <div className="value">{remainingTime}</div>
            <div className="text">seconds</div>
        </div>
    );
};

function Timer(props) {
    return (

        <div className="Timer">

            <div className="timer-wrapper">
                <br></br>
                <CountdownCircleTimer
                    isPlaying
                    duration={props.timeLeft}
                    colors={"#3589e1"}
                    onComplete={() => [false, 0]}
                >
                    {renderTime}
                </CountdownCircleTimer>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Timer timeLeft />, rootElement);
export default Timer;
