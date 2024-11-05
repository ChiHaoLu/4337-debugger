import React, { useState } from "react";
import { Address, formatEther, fromHex, Hex, zeroAddress } from "viem";
import {
  getPublicClient,
  INFRA_ADDRESS,
  BundlerMode,
  BundlerProvider,
} from "@consenlabs/imaccount-sdk";
import { UserOpReceipt } from "../types/receipt";
import Header from "./header";

enum DataType {
  Address = "/address/",
  Transaction = "/tx/",
  Block = "/block/",
}

const Explorer = () => {
  const [userOpHash, setUserOpHash] = useState<Hex>(
    "0x95193f1f7d7cac1caa3385a33ce7a63dc3b66d3ba91059addfcaaf1091834fcc"
  );
  const [ALCHEMY_RPC_URL, setALCHEMY_RPC_URL] = useState(
    process.env.NEXT_PUBLIC_RPC_URL ??
      "https://<chain_prefix>.g.alchemy.com/v2/<your_api_key>"
  );
  const [userOpReceipt, setUserOpReceipt] = useState<UserOpReceipt | null>(
    null
  );
  const [fetching, setFetching] = useState(false);

  const isFetchDisabled = !userOpHash || !ALCHEMY_RPC_URL;

  const hexToReadableString = (num: Hex): string => {
    return String(fromHex(num, "bigint"));
  };

  const mapToUserOpReceipt = (receipt: any): UserOpReceipt => {
    return {
      userOpHash: receipt.userOpHash || "",
      entryPoint: receipt.entryPoint || zeroAddress,
      sender: receipt.sender || zeroAddress,
      nonce: receipt.nonce || "",
      paymaster: receipt.paymaster || zeroAddress,
      actualGasCost:
        formatEther(fromHex(receipt.actualGasCost, "bigint"), "wei") || "",
      actualGasUsed: hexToReadableString(receipt.actualGasUsed) || "",
      success: receipt.success,
      reason: receipt.reason,
      logs: receipt.logs || [],
      receipt: {
        type: receipt.receipt.type || "",
        status: receipt.receipt.status || "",
        cumulativeGasUsed: receipt.receipt.cumulativeGasUsed || "",
        logs: receipt.receipt.logs || [],
        logsBloom: receipt.receipt.logsBloom || "",
        transactionHash: receipt.receipt.transactionHash,
        transactionIndex: receipt.receipt.transactionIndex || "",
        blockHash: receipt.receipt.blockHash || "",
        blockNumber: hexToReadableString(receipt.receipt.blockNumber) || "",
        gasUsed: receipt.receipt.gasUsed || "",
        effectiveGasPrice: receipt.receipt.effectiveGasPrice || "",
        from: receipt.receipt.from || zeroAddress,
        to: receipt.receipt.to || zeroAddress,
        contractAddress: receipt.receipt.contractAddress || zeroAddress,
      },
    };
  };

  const getExplorerLink = (address: string, type: DataType): string => {
    if (!ALCHEMY_RPC_URL) return "https://";

    const provider = getPublicClient(ALCHEMY_RPC_URL);
    const explorerLink = provider.chain?.blockExplorers?.default.url;

    if (!explorerLink) return "https://";

    const dataLink = explorerLink + type + address;
    console.log(explorerLink + type + address);
    return dataLink;
  };

  const getUserOpByHash = async () => {
    if (!userOpHash || !ALCHEMY_RPC_URL) {
      alert("Please fill in all required fields.");
      return;
    }

    setFetching(true);
    const bundler = new BundlerProvider({
      url: ALCHEMY_RPC_URL,
      entryPoint: INFRA_ADDRESS.ENTRY_POINT,
      mode: BundlerMode.Auto,
    });

    try {
      const receipt = await bundler.getUserOperationReceipt(userOpHash);
      const completeReceipt = mapToUserOpReceipt(receipt);
      setUserOpReceipt(completeReceipt);
    } catch (error) {
      console.error(error);
      alert(`Fetching failed.\n${error}`);
      setUserOpReceipt(null);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div>
      <Header />
      <h2>AA Explorer</h2>
      <div>
        <label>
          UserOp Hash:
          <input
            type="text"
            value={userOpHash}
            onChange={(e) => setUserOpHash(e.target.value as Hex)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Alchemy RPC URL:
          <input
            type="text"
            value={ALCHEMY_RPC_URL}
            onChange={(e) => setALCHEMY_RPC_URL(e.target.value)}
            required
          />
        </label>
      </div>
      <button onClick={getUserOpByHash} disabled={fetching || isFetchDisabled}>
        {fetching ? "Fetching..." : "Fetch UserOp"}
      </button>
      {userOpReceipt && (
        <div className="explorer-result">
          <h3>User Operation Info:</h3>
          <div className="data-section">
            <div>
              <span className="label">UserOp Hash</span>{" "}
              {userOpReceipt.userOpHash}
            </div>
            <div>
              <span className="label">Sender</span>{" "}
              <a
                href={getExplorerLink(userOpReceipt.sender, DataType.Address)}
                target="_blank"
              >
                {userOpReceipt.sender}
              </a>
            </div>
            <div>
              <span className="label">Nonce</span> {userOpReceipt.nonce}
            </div>
            <div>
              <span className="label">Success</span>{" "}
              {userOpReceipt.success ? "✅ Yes" : "❌ No"}
            </div>
            {userOpReceipt.reason !== "" && (
              <div>
                <span className="label">Reason</span> {userOpReceipt.reason}
              </div>
            )}

            <h4>Payment Info</h4>
            <div>
              <span className="label">Paymaster</span>{" "}
              <a
                href={getExplorerLink(
                  userOpReceipt.paymaster,
                  DataType.Address
                )}
                target="_blank"
              >
                {userOpReceipt.paymaster}
              </a>
            </div>
            <div>
              <span className="label">Gas Cost</span>{" "}
              {userOpReceipt.actualGasCost} ETH
            </div>
            <div>
              <span className="label">Gas Used</span>{" "}
              {userOpReceipt.actualGasUsed}
            </div>

            <h4>4337 Details</h4>
            <div>
              <span className="label">Entry Point</span>{" "}
              <a
                href={getExplorerLink(
                  userOpReceipt.entryPoint,
                  DataType.Address
                )}
                target="_blank"
              >
                {userOpReceipt.entryPoint}
              </a>
            </div>
            <div>
              <span className="label">Beneficiary / Bundler</span>{" "}
              <a
                href={getExplorerLink(
                  userOpReceipt.receipt.from,
                  DataType.Address
                )}
                target="_blank"
              >
                {userOpReceipt.receipt.from}
              </a>
            </div>
            <div>
              <span className="label">Bundle Tx Hash</span>{" "}
              <a
                href={getExplorerLink(
                  userOpReceipt.receipt.transactionHash,
                  DataType.Transaction
                )}
                target="_blank"
              >
                {userOpReceipt.receipt.transactionHash}
              </a>
            </div>
            <div>
              <span className="label">Block Number</span>{" "}
              <a
                href={getExplorerLink(
                  userOpReceipt.receipt.blockHash,
                  DataType.Block
                )}
                target="_blank"
              >
                {userOpReceipt.receipt.blockNumber}
              </a>
            </div>
          </div>
          <div className="data-section">
            <h4>Logs</h4>
            {userOpReceipt.logs &&
              userOpReceipt.logs.map((log: any, index: number) => (
                <div key={index} className="log-entry">
                  <div>
                    <span className="label">Address</span>{" "}
                    <a
                      href={getExplorerLink(log.address, DataType.Address)}
                      target="_blank"
                    >
                      {log.address}
                    </a>
                  </div>
                  <div>
                    <span className="label">Topics</span>
                    <div>{log.topics.join("\n ")}</div>
                  </div>
                  <div>
                    <span className="label">Data</span>
                    <div className="data-box">{log.data}</div>
                  </div>
                </div>
              ))}
          </div>

          <h4>Whole Receipt in JSON</h4>
          <pre>{JSON.stringify(userOpReceipt, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Explorer;
