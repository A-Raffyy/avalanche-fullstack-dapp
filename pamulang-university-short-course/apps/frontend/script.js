const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const nimEl = document.getElementById("nim");
const namaEl = document.getElementById("nama");

// Avalanche Fuji Testnet chainId (hex)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function setErrorUI(message) {
  statusEl.textContent = message;
  statusEl.style.color = "#e84118";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
}

function resetUI() {
  statusEl.textContent = "Disconnected ❌";
  statusEl.style.color = "#e84118";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
  nimEl.textContent = "-";
  namaEl.textContent = "-";
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
  connectBtn.textContent = "Connect Wallet";
}

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    setErrorUI("Wallet not detected ❌");
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

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";
      networkEl.textContent = "Avalanche Fuji Testnet";
      nimEl.textContent = "251011401313";
      namaEl.textContent = "Ar Rafi Ramadhan";

      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      balanceEl.textContent = formatAvaxBalance(balanceWei);

      connectBtn.disabled = true;
      disconnectBtn.disabled = false;
      connectBtn.textContent = "Connected";
    } else {
      setErrorUI("Please switch to Avalanche Fuji ⚠️");
    }
  } catch (error) {
    console.error(error);
    setErrorUI("Connection Failed ❌");
  }
}

function disconnectWallet() {
  resetUI();
}

// Listen events
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

connectBtn.addEventListener("click", connectWallet);
disconnectBtn.addEventListener("click", disconnectWallet);
