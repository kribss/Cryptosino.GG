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

function Timer() {
    return (

        <div className="Timer">

            <div className="timer-wrapper">
                <br></br>
                <CountdownCircleTimer
                    isPlaying
                    duration={60}
                    colors={"#3589e1"}
                    onComplete={() => [true, 1000]}
                >
                    {renderTime}
                </CountdownCircleTimer>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Timer />, rootElement);
export default Timer;
