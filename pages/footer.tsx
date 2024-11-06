import React from "react";

const Footer = () => {
  return (
    <div>
      <h3>Project Dependencies</h3>
      <p>
        consenlabs@/imaccount-sdk:{" "}
        <a
          href="https://github.com/consenlabs/imaccount-sdk"
          target="_blank"
          rel="noopener noreferrer"
        >
          v0.1.29
        </a>
      </p>

      <h3>Project Inspiration</h3>
      <ul>
        <li className="list">Tenderly</li>
        <li className="list">Pimlico Debugger</li>
        <li className="list">Jiffyscan</li>
      </ul>
    </div>
  );
};

export default Footer;
