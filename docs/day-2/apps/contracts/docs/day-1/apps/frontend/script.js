const walletBtn = document.getElementById("walletBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const nimEl = document.getElementById("nim");
const namaEl = document.getElementById("nama");

const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

let isConnected = false;

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function resetUI() {
  statusEl.textContent = "Disconnected ❌";
  statusEl.style.color = "#e84118";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
  nimEl.textContent = "-";
  namaEl.textContent = "-";
  walletBtn.textContent = "Connect Wallet";
  isConnected = false;
}

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    return;
  }

  try {
    statusEl.textContent = "Connecting...";
    statusEl.style.color = "#fbc531";

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    addressEl.textContent = shortenAddress(address);

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId !== AVALANCHE_FUJI_CHAIN_ID) {
      statusEl.textContent = "Wrong Network ❌";
      networkEl.textContent = "Please switch to Fuji";
      return;
    }

    networkEl.textContent = "Avalanche Fuji Testnet";
    statusEl.textContent = "Connected ✅";
    statusEl.style.color = "#4cd137";
    nimEl.textContent = "251011401313";
    namaEl.textContent = "Ar Rafi Ramadhan";

    const balanceWei = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });

    balanceEl.textContent = formatAvaxBalance(balanceWei);

    walletBtn.textContent = "Disconnect";
    isConnected = true;
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Connection Failed ❌";
  }
}

function disconnectWallet() {
  resetUI();
}

walletBtn.addEventListener("click", () => {
  if (!isConnected) {
    connectWallet();
  } else {
    disconnectWallet();
  }
});

if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      resetUI();
    } else {
      addressEl.textContent = shortenAddress(accounts[0]);
    }
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}
