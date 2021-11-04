module.exports = async (hre) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("Plines", {
    from: deployer,
    log: true,
  });

  await execute("Plines", {
      from: deployer,
      log: true,
    },
    "initialize",
  );
};

module.exports.tags = ["Plines"];
