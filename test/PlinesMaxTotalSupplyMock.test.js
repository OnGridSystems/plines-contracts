const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("Plines maxTotalSupplyMock", function () {
  before(async function () {
    const accounts = await ethers.getSigners();
    this.deployer = accounts[0];
    this.other = accounts[1];
    this.grantedAdmin = accounts[2];
    this.plinesArtifact = await ethers.getContractFactory("PlinesMaxTotalSupplyMock");
  });
  beforeEach(async function () {
    this.plines = await upgrades.deployProxy(this.plinesArtifact);
  });

  describe("grant minter and admin role", function () {
    beforeEach(async function () {
      await this.plines.grantRole(await this.plines.MINTER_ROLE(), this.grantedAdmin.address);
      await this.plines.grantRole(await this.plines.DEFAULT_ADMIN_ROLE(), this.grantedAdmin.address);
    });

    it("totalSupply equal 0", async function () {
      expect(await this.plines.connect(this.grantedAdmin).totalSupply()).to.be.equal(0);
    });

    describe("mintMultiple 5 tokens", function () {
      beforeEach(async function () {
        await this.plines.connect(this.grantedAdmin).mintMultiple(this.other.address, 5);
      });

      it("totalSupply equal 5 after mintMultiple 5 tokens", async function () {
        expect(await this.plines.connect(this.grantedAdmin).totalSupply()).to.be.equal(5);
      });

      it("Exceeds maxTotalSupply after mintMultiple more 10 tokens", async function () {
        await expect(this.plines.connect(this.grantedAdmin).mintMultiple(this.other.address, 10)).to.be.revertedWith(
          "Exceeds maxTotalSupply"
        );
      });

      describe("mintMultiple more 5 tokens", function () {
        beforeEach(async function () {
          await this.plines.connect(this.grantedAdmin).mintMultiple(this.other.address, 5);
        });

        it("totalSupply equal 10 after mintMultiple 10 tokens", async function () {
          expect(await this.plines.connect(this.grantedAdmin).totalSupply()).to.be.equal(10);
        });

        it("reverted with 'Exceeds maxTotalSupply' after mintMultiple 5 more tokens", async function () {
          await expect(this.plines.connect(this.grantedAdmin).mintMultiple(this.other.address, 5)).to.be.revertedWith(
            "Exceeds maxTotalSupply"
          );
        });

        it("reverted with 'mintIndex > maxTotalSupply' after mintMultiple 5 more tokens", async function () {
          await expect(this.plines.connect(this.grantedAdmin).mint(this.other.address, 10)).to.be.revertedWith(
            "mintIndex > maxTotalSupply"
          );
        });
      });
    });
  });
});
