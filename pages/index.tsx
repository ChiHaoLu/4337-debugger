import React, { useState } from "react";
import {
  simulate,
  BundlerUserOperationData,
  PackedUserOperation,
  unwrap,
  wrap,
  SimulateType,
} from "@consenlabs/imaccount-sdk";
import { Address } from "viem";

const Home = () => {
  // Tenderly Config
  const [TENDERLY_ACCESS_KEY, setTENDERLY_ACCESS_KEY] = useState("");
  const [projectOwner, setProjectOwner] = useState("ChiHaoLu");
  const [projectName, setProjectName] = useState("aatest");
  const [richBundlerEOA, setRichBundlerEOA] = useState<Address>(
    "0x4d7f573039fddc84fdb28515ba20d75ef6b987ff"
  );
  const [network, setNetwork] = useState("11155111");
  const [blockNumber, setBlockNumber] = useState("latest");
  const [simulateType, setSimulateType] = useState<SimulateType>(
    SimulateType.Send
  );

  // userOp input
  const [input, setInput] = useState(`{
    sender: "0x8b8aF275602891ddDf4d60783A80A01bf56f8F64",
    nonce: "0x31",
    callData: "0xe9ae5c53010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001842b67b570000000000000000000000000f7728cf90ad4cb9a14342827641056fd2e88a82e0000000000000000000000001c7d4b196cb0c7b01d743fbc6116a902379c72380000000000000000000000000000000000000000000000000000000000e4e1c00000000000000000000000000000000000000000000000000000000066f0e1be000000000000000000000000000000000000000000000000000000000000000000000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc450000000000000000000000000000000000000000000000000000000066f0e1be000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000557a61f7aa49341fb0ef67b1376f84b72bf1063a678417b73b0a2bc06100a7b3d880f51c8837b46a14fa235ac1441ad436681fb0d73e39e869f79f52f46212fc9575f2bd6cb9c522f32be0e1ba49f0e2a3987c018e1c000000000000000000000000000000000000000000000000000000000000000000000000000000",
    callGasLimit: "0x0",
    verificationGasLimit: "0x0",
    preVerificationGas: "0x0",
    maxFeePerGas: "0x1",
    maxPriorityFeePerGas: "0x1",
    paymasterVerificationGasLimit: "0x0",
    paymasterPostOpGasLimit: "0x0",
    signature:"0x7a61f7aa49341fb0ef67b1376f84b72bf1063a67fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"
  }`);
  const [parsedInput, setParsedInput] = useState<{
    unwrapped: BundlerUserOperationData;
    wrapped: PackedUserOperation;
    serialized: string;
  } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Result
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const isSimulateDisabled =
    !TENDERLY_ACCESS_KEY || !projectOwner || !projectName || !richBundlerEOA;

  const handleSimulate = async () => {
    if (
      !TENDERLY_ACCESS_KEY ||
      !projectOwner ||
      !projectName ||
      !richBundlerEOA ||
      !parsedInput
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const simulationResult = await simulate(
        simulateType,
        TENDERLY_ACCESS_KEY,
        richBundlerEOA,
        parsedInput.wrapped,
        projectOwner,
        projectName,
        network,
        blockNumber
      );

      setResult(JSON.stringify(simulationResult, null, 2));
    } catch (error) {
      console.error(error);
      alert(`Simulation failed.\n${error}`);
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  function serialize(parsed: any): Record<string, any> {
    return Object.entries(parsed).reduce(
      (acc, [key, value]) => {
        if (
          typeof value === "string" &&
          /^0x[a-fA-F0-9]+$/.test(value) &&
          (key.includes("gas") || key.includes("Gas")) &&
          key !== "accountGasLimits" &&
          key !== "gasFees"
        ) {
          acc[key] = String(BigInt(value));
        } else if (typeof value === "bigint") {
          acc[key] = String(value);
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );
  }

  function parse(parsed: {
    unwrapped: BundlerUserOperationData;
    wrapped: PackedUserOperation;
  }): string {
    return JSON.stringify(
      {
        wrapped: serialize(parsed.wrapped),
        unwrapped: serialize(parsed.unwrapped),
      },
      null,
      2
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResult("");
    const text = e.target.value;
    setInput(text);
    try {
      const parsed = JSON.parse(
        text
          .replace(/([a-zA-Z0-9]+):/g, '"$1":') // Add quotes around keys
          .replace(/'/g, '"') // Replace single quotes with double quotes
      );

      // Check and transform BigInt values where necessary
      if (parsed.accountGasLimits !== undefined) {
        const serialized = parse({
          wrapped: parsed as PackedUserOperation,
          unwrapped: unwrap(parsed as PackedUserOperation),
        });
        setParsedInput({
          wrapped: parsed as PackedUserOperation,
          unwrapped: unwrap(parsed as PackedUserOperation),
          serialized: serialized,
        });
      } else {
        const serialized = parse({
          wrapped: wrap(parsed as BundlerUserOperationData),
          unwrapped: parsed as BundlerUserOperationData,
        });
        setParsedInput({
          wrapped: wrap(parsed as BundlerUserOperationData),
          unwrapped: parsed as BundlerUserOperationData,
          serialized: serialized,
        });
      }
      setParseError(null);
    } catch (error) {
      setParseError(`Invalid JSON format.\n${error}`);
      setParsedInput(null);
    }
  };

  const handleResultClick = () => {
    const url = result.startsWith('"') ? JSON.parse(result) : result;
    window.open(url, "_blank");
  };

  return (
    <div>
      <div className="warning-banner">
        <p>
          This default configuration currently only supports the Sepolia
          Testnet.
          <br /> If you wish to use a different network, please create a
          Tenderly project on your own.
        </p>
      </div>
      <h1>AA Debugger</h1>

      <div>
        <p>
          Twitter:{" "}
          <a
            href="https://twitter.com/murmurlu"
            target="_blank"
            rel="noopener noreferrer"
          >
            @murmurlu
          </a>
        </p>
        <p>
          Github Repo:{" "}
          <a
            href="https://github.com/ChiHaoLu/4337-debugger/tree/main"
            target="_blank"
            rel="noopener noreferrer"
          >
            4337-debugger
          </a>
        </p>
      </div>

      <h2>1. Fill Up the Tenderly Config</h2>
      <div>
        <label>
          TENDERLY_ACCESS_KEY:
          <input
            type="text"
            value={TENDERLY_ACCESS_KEY}
            onChange={(e) => setTENDERLY_ACCESS_KEY(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Project Owner:
          <input
            type="text"
            value={projectOwner}
            onChange={(e) => setProjectOwner(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Rich Bundler EOA:
          <input
            type="text"
            value={richBundlerEOA}
            onChange={(e) => setRichBundlerEOA(e.target.value as Address)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Chain ID:
          <input
            type="text"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Block Number:
          <input
            type="text"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value)}
            required
          />
        </label>
      </div>

      <h2>2. Give your userOp</h2>
      <h3>Simulate Usage</h3>
      <div>
        <label>
          Simulate Type (where you meet the problem?):{" "}
          <select
            value={simulateType}
            onChange={(e) => setSimulateType(e.target.value as SimulateType)}
          >
            {Object.values(SimulateType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <h3>UserOp Input</h3>
      <div>
        <label>
          <textarea
            rows={30}
            cols={100}
            value={input}
            onChange={handleInputChange}
            placeholder="Paste your User Operation in JSON here"
            required
          />
        </label>
        {parseError && <p style={{ color: "red" }}>{parseError}</p>}
        {parsedInput && (
          <div>
            <h3>Parsed Input Data:</h3>
            <pre>{parsedInput.serialized}</pre>
          </div>
        )}
      </div>

      <h2>3. Simulate Time!</h2>
      <button onClick={handleSimulate} disabled={loading || isSimulateDisabled}>
        {loading ? "Simulating..." : "Run Simulation"}
      </button>
      {result !== "" && (
        <div className="simulation-result">
          <h3>Simulation Result:</h3>
          <button onClick={handleResultClick}>
            Go to Dashboard! (required login Tenderly)
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
