import React, { useState } from "react";
import {
  logEntryInfo,
  logAccountInfo,
  getPublicClient,
  InfoType,
} from "@consenlabs/imaccount-sdk";
import { Address } from "viem";
import Header from "./header";

enum AddressType {
  Entry = "Entry",
  Account = "Account",
}

const AccountInfo = () => {
  const [address, setAddress] = useState<Address>(
    "0xea67ba18ab79c208369f7f40cf21a27c41f605f2"
  );
  const [type, setType] = useState<AddressType>(AddressType.Entry);
  const [ALCHEMY_RPC_URL, setALCHEMY_RPC_URL] = useState(
    process.env.NEXT_PUBLIC_RPC_URL ??
      "https://<chain_prefix>.g.alchemy.com/v2/<your_api_key>"
  );
  const [fetching, setFetching] = useState(false);
  const [info, setInfo] = useState<InfoType | null>();

  const isFetchDisabled = !address || !type || !ALCHEMY_RPC_URL;

  const getWalletInfo = async () => {
    if (!address || !type || !ALCHEMY_RPC_URL) {
      alert("Please fill in all required fields.");
      return;
    }

    const provider = getPublicClient(ALCHEMY_RPC_URL);
    setFetching(true);

    try {
      let res: InfoType | null;
      if (type === AddressType.Account) {
        res = await logAccountInfo(provider, address);
      } else {
        res = await logEntryInfo(provider, address);
      }
      setInfo(res);
    } catch (error) {
      console.error(error);
      alert(`Fetching failed.\n${error}`);
      setInfo(null);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div>
      <Header />
      <h2>imToken AA Wallet Infomation</h2>
      <div className="warning-banner">
        <p>It is an experimental feature. Please use it cautiously.</p>
      </div>
      <div>
        <h4>Address</h4>
        <label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value as Address)}
            required
          />
        </label>
        <h4>Contract Type</h4>
        <label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AddressType)}
          >
            {Object.values(AddressType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button onClick={getWalletInfo} disabled={fetching || isFetchDisabled}>
          {fetching ? "Fetching..." : "Fetch Info"}
        </button>
        {info && (
          <div>
            <h3>Wallet Infomation</h3>
            <pre>{JSON.stringify(info, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
