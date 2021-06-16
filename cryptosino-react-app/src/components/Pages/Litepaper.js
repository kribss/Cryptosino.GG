import React from "react";


function Litepaper() {
    return (
        <div className="litepaperpdf">
            <embed
                src="CryptosinoLitePaper.pdf"
                type="application/pdf"
                frameBorder="0"
                scrolling="auto"
                height="100%"
                width="100%"
            ></embed>
        </div>
    );
}

export default Litepaper;