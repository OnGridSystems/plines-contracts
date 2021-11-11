const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("PlinesPresale", function () {
  const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

  const amount = 10;
  const price = ethers.utils.parseEther("0.05");
  const maxAmountPerPurchase = 20;
  const presaleDAppURI = "https://presale.plines.io";

  before(async function () {
    this.signers = await ethers.getSigners();
    this.deployer = this.signers[0];
    this.account = this.signers[1];
    this.vault = this.signers[2];
    this.Plines = await ethers.getContractFactory("Plines");
    this.PlinesPresale = await ethers.getContractFactory("PlinesPresale");
  });

  beforeEach(async function () {
    this.plines = await this.Plines.deploy();
    await this.plines.initialize();
    this.plinesPresale = await this.PlinesPresale.deploy(
      price,
      maxAmountPerPurchase,
      this.vault.address,
      this.plines.address,
      presaleDAppURI
    );
    await this.plines.grantRole(MINTER_ROLE, this.plinesPresale.address);
  });
  it("exceeding maxAmountPerPurchase", async function () {
      expect(this.plinesPresale.buy(maxAmountPerPurchase + 1, presaleDAppURI, {value: price.mul(amount)}))
        .to.be.revertedWith("Can not buy > maxAmountPerPurchase");
  });
  it("wrong presaleDAppURI", async function () {
      const wrongURI = "https://wrongURI";
      expect(this.plinesPresale.buy(
          amount,
          wrongURI,
          {value: price.mul(amount)}
        )
      ).to.be.revertedWith("Wrong presaleDAppURI");
  });
  it("wrong getTotalPrice", async function () {
      expect(this.plinesPresale.buy(
          amount,
          presaleDAppURI,
          {value: price.mul(amount).div(2)}
        )
      ).to.be.revertedWith("BAD_VALUE");
  });
  describe("Buy tokens", function () {
    beforeEach(async function () {
      deployerBalance = await ethers.provider.getBalance(this.deployer.address);
      buy = await this.plinesPresale.buy(amount, presaleDAppURI, {value: price.mul(amount)});
    });
    it("emits event Buy", async function () {
      expect(buy).to.emit(this.plinesPresale, "Buy").withArgs(this.deployer.address, amount, price.mul(amount));
    });
    it("user's balance has decreased", async function () {
      expect(deployerBalance).be.above(await ethers.provider.getBalance(this.deployer.address));
    });
    it("the user received the required amount of tokens", async function () {
      expect(await this.plines.balanceOf(this.deployer.address)).to.be.equal(amount);
    });
  });
});
