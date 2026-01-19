"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { avalancheFuji } from "wagmi/chains";

// ==============================
// 🔹 CONFIG
// ==============================

// 👉 GANTI dengan contract address hasil deploy kamu day 2
const CONTRACT_ADDRESS = "0xD9d796dE74188E7da363EDA5535c681c21E6F708";

// 👉 ABI SIMPLE STORAGE
const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ==============================
  // 🔹 WALLET STATE
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  // ==============================
  // 🔹 LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // ==============================
  // 🔹 READ CONTRACT
  // ==============================
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  // ==============================
  // 🔹 WRITE CONTRACT
  // ==============================
  const {
    writeContract,
    data: hash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  // ==============================
  // 🔹 WAIT FOR TX
  // ==============================
  const {
    isLoading: isConfirming,
    isSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // ==============================
  // 🔹 EFFECTS
  // ==============================
  // Refresh value after tx success
  useEffect(() => {
    if (isSuccess) {
      refetch();
      setToastMessage("Transaction successful!");
      setTimeout(() => setToastMessage(""), 3000);
    }
  }, [isSuccess, refetch]);

  // Handle errors
  useEffect(() => {
    const errorMessage = writeError?.message || txError?.message || "";
    if (errorMessage) {
      if (errorMessage.includes("User rejected")) {
        setToastMessage("Transaction rejected by user.");
      } else if (errorMessage.includes("revert")) {
        setToastMessage("Transaction reverted.");
      } else {
        setToastMessage("Transaction failed.");
      }
      setTimeout(() => setToastMessage(""), 5000);
    }
  }, [writeError, txError]);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-full max-w-md border border-gray-700 rounded-lg p-6">
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </main>
    );
  }

  // Check network
  const isWrongNetwork = chainId !== avalancheFuji.id;

  const handleSetValue = async () => {
    if (!inputValue || isWrongNetwork) return;

    setToastMessage("");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(inputValue)],
    });
  };

  // ==============================
  // 🔹 UTILS
  // ==============================
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // ==============================
  // 🔹 UI
  // ==============================
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-lg p-6 space-y-6">
        <h1 className="text-xl font-bold">Day 3 – Frontend dApp (Avalanche)</h1>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-blue-600 text-white p-2 rounded text-center">
            {toastMessage}
          </div>
        )}

        {/* ==========================
            WALLET CONNECT
        ========================== */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full bg-white text-black py-2 rounded"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Connected Address</p>
            <p className="font-mono text-xs break-all">
              {shortenAddress(address!)}
            </p>

            <button
              onClick={() => disconnect()}
              className="text-red-400 text-sm underline"
            >
              Disconnect
            </button>

            {isWrongNetwork && (
              <p className="text-red-400 text-sm">
                Wrong network! Switch to Avalanche Fuji.
              </p>
            )}
          </div>
        )}

        {/* ==========================
            READ CONTRACT
        ========================== */}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-sm text-gray-400">Contract Value (read)</p>

          {isReading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold">{value?.toString()}</p>
          )}

          <button
            onClick={() => refetch()}
            className="text-sm underline text-gray-300"
          >
            Refresh value
          </button>
        </div>

        {/* ==========================
            WRITE CONTRACT
        ========================== */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <p className="text-sm text-gray-400">Update Contract Value</p>

          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded bg-black border border-gray-600"
          />

          <button
            onClick={handleSetValue}
            disabled={
              isWriting || isConfirming || isWrongNetwork || !inputValue
            }
            className="w-full bg-blue-600 py-2 rounded disabled:opacity-50"
          >
            {isWriting || isConfirming ? "Processing..." : "Set Value"}
          </button>
        </div>

        {/* ==========================
            FOOTNOTE
        ========================== */}
        <p className="text-xs text-gray-500 pt-2">
          Smart contract = single source of truth
        </p>
      </div>
    </main>
  );
}
