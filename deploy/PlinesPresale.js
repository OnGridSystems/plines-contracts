const {ethers} = require("hardhat");
module.exports = async (hre) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const price = ethers.utils.parseEther("0.05");
  const maxAmountPerPurchase = 20;
  const vault = deployer
  const presaleDAppURI = "https://presale.plines.io";

  const plines = await deployments.get("Plines");

  await deploy("PlinesPresale", {
    from: deployer,
    log: true,
    args: [
      price,
      maxAmountPerPurchase,
      vault,
      plines.address,
      presaleDAppURI
    ],
  });

  const plinesPresale = await deployments.get("PlinesPresale");
  const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

  await execute(
    'Plines',
    { from: deployer, log: true },
    'grantRole',
    MINTER_ROLE,
    plinesPresale.address
  );
};

module.exports.tags = ["PlinesPresale"];
module.exports.dependencies = ["Plines"]
