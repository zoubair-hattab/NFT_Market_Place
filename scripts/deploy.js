const hre = require('hardhat');
async function main() {
  const NFTMarket = await hre.ethers.deployContract('NFTMarket');
  await NFTMarket.waitForDeployment();
  console.log(`NFTMarket is deployed to ${NFTMarket.target}`);
  const NFT = await hre.ethers.deployContract('NFTToken');
  await NFT.waitForDeployment();
  console.log(`NFT is deployed to ${NFT.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
