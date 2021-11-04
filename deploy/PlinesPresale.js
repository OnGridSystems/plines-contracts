const {ethers} = require("hardhat");
module.exports = async (hre) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const price = ethers.utils.parseEther("0.05");
  const maxAmountPerPurchase = 20;
  const vault = "0x31372a2B98CC394178A1b041BB67ED9671361208";
  const presaleDAppURI = "https://presale.plines.io";

  const { abi, address: addressPlines } = await deployments.get("Plines");

  await deploy("PlinesPresale", {
    from: deployer,
    log: true,
    args: [
      price,
      maxAmountPerPurchase,
      vault,
      addressPlines,
      presaleDAppURI
    ],
  });

  const { address: addressPlinesPresale } = await deployments.get("PlinesPresale");
  const plinesContract = await ethers.getContractAt(abi, addressPlines);
  await plinesContract.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
      addressPlinesPresale
  );
};

module.exports.tags = ["PlinesPresale"];
module.exports.dependencies = ["Plines"]
