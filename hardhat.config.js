require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("@openzeppelin/hardhat-upgrades");

const accounts = {
  mnemonic: `${process.env.MNEMONIC}`,
};

module.exports = {
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      hardfork: "berlin",
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_RINKEBY_API_KEY}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 8000000000,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 1,
      live: true,
      saveDeployments: true,
      gasPrice: 145000000000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
