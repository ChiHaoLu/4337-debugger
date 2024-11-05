import { Address } from "viem";

export type Log = {
  address: Address;
  topics: string[];
  data: string;
  blockHash: string;
  blockNumber: string;
  transactionHash: string;
  transactionIndex: string;
  logIndex: string;
  removed: boolean;
};

export type Receipt = {
  type: string;
  status: string;
  cumulativeGasUsed: string;
  logs?: Log[];
  logsBloom: string;
  transactionHash: string;
  transactionIndex: string;
  blockHash: string;
  blockNumber: string;
  gasUsed: string;
  effectiveGasPrice: string;
  from: Address;
  to: Address;
  contractAddress: Address | null;
};

export type UserOpReceipt = {
  userOpHash: string;
  entryPoint: Address;
  sender: Address;
  nonce: string;
  paymaster: Address;
  actualGasCost: string;
  actualGasUsed: string;
  success: boolean;
  reason: string;
  logs?: Log[];
  receipt: Receipt;
};
