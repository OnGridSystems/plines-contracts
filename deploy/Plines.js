module.exports = async (hre) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("Plines", {
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
        },
      },
    },
    log: true,
  });

  await execute(
    'Plines',
    { from: deployer, log: true },
    'setBaseUri',
    'ipfs://QmSkzcejeoS3eFsTD3NyHkvvZxRKYXFqS4nJWxZF8pyFY2'
  );

  await execute(
    'Plines',
    { from: deployer, log: true },
    'mintMultiple',
    deployer,
    50
  );
};

module.exports.tags = ["Plines"];
