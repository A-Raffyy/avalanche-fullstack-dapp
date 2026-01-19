"use client";

import { useState } from "react";
import { createWalletClient, custom } from "viem";
import { avalancheFuji } from "viem/chains";
import {
  SIMPLE_STORAGE_ABI,
  SIMPLE_STORAGE_ADDRESS,
} from "../contracts/abi/simpleStorage";

export default function SetValuePage() {
  const [value, setValue] = useState("");

  async function handleSetValue() {
    if (!window.ethereum) {
      alert("Wallet tidak ditemukan");
      return;
    }

    const walletClient = createWalletClient({
      chain: avalancheFuji,
      transport: custom(window.ethereum),
    });

    const [account] = await walletClient.getAddresses();

    if (!account) {
      alert("Wallet belum terhubung");
      return;
    }

    await walletClient.writeContract({
      address: SIMPLE_STORAGE_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(value)],
      account,
    });

    alert("Transaction sent!");
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Set Value</h1>

      <input
        type="number"
        className="border px-3 py-2 rounded"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Masukkan nilai"
      />

      <button
        onClick={handleSetValue}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Set Value
      </button>
    </main>
  );
}
