import React from "react";
import Header from "./header";

const Tool = () => {
  return (
    <div>
      <Header />
      <h2>Debug Toolkit</h2>
      <ul>
        <li>
          <a
            href="https://tools.deth.net/eth-unit-conversion"
            target="_blank"
            rel="noopener noreferrer"
          >
            dETH Tools
          </a>
          : A handy toolset for every Ethereum developer, includes
          <ul>
            <li className="list">Eth Unit Conversion</li>
            <li className="list">Token Unit Conversion</li>
            <li className="list">Unix Epoch (timestamp) Conversion</li>
            <li className="list">String - Bytes32 Conversion</li>
            <li className="list">Calldata Decoder</li>
            <li className="list">Event Decoder</li>
            <li className="list">Tx Decoder</li>
            <li className="list">Constructor Encoder</li>
            <li className="list">Vanity Address Generator</li>
          </ul>
        </li>
        <li>
          <a
            href="https://www.etherface.io/hash"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ethereum Function Signature DataBase
          </a>
          : Find the function signature (function name and params) by their hash
          (function selector).
        </li>
      </ul>
    </div>
  );
};

export default Tool;
