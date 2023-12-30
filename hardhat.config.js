require('@nomicfoundation/hardhat-toolbox');
module.exports = {
  solidity: '0.8.19',
  // defaultNetwork: "rinkeby",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/Qe_VE6R98jL7sBiUgRbdCeKcu4dJbmAP`,
      accounts: ['here your pivate key account'],
    },
  },
};
