const hre = require("hardhat");

async function main() {
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const contract = await SimpleStorage.deploy();

  await contract.waitForDeployment();

  console.log("✅ Deployed to:", await contract.getAddress());

  // Test setValue to emit ValueUpdated event
  const tx1 = await contract.setValue(42);
  await tx1.wait();
  console.log("✅ Value set to 42, ValueUpdated event emitted");

  // Test setMessage to emit MessageUpdated event
  const tx2 = await contract.setMessage("Hello, World!");
  await tx2.wait();
  console.log(
    "✅ Message set to 'Hello, World!', MessageUpdated event emitted"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
