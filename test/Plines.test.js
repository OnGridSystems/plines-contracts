const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { cons } = require("fp-ts/lib/NonEmptyArray2v");

describe("Plines", function () {
  before(async function () {
    const accounts = await ethers.getSigners();
    this.provider = ethers.getDefaultProvider();
    this.deployer = accounts[0];
    this.other = accounts[1];
    this.grantedAdmin = accounts[2];
    this.PlinesArtifact = await ethers.getContractFactory("Plines");
  });
  beforeEach(async function () {
    this.plines = await upgrades.deployProxy(this.PlinesArtifact);
  });

  it("setBaseUri reverts if called by wrong role", async function () {
    await expect(this.plines.connect(this.provider).setBaseUri("ipfs://ipfs/baseUri")).to.be.reverted;
  });

  it("mint reverts if called by wrong role", async function () {
    await expect(this.plines.connect(this.provider).mint(this.other.address, 1)).to.be.reverted;
  });

  it("mintMultiple reverts if called by wrong role", async function () {
    await expect(this.plines.connect(this.provider).mintMultiple(this.other.address, 20)).to.be.reverted;
  });

  it("maxTotalSupply are 17000", async function () {
    expect(await this.plines.maxTotalSupply()).to.equal(17000);
  });

  it("tokenURI reverts if requested URI query for nonexistent token", async function () {
    await expect(this.plines.connect(this.provider).tokenURI(1)).to.be.reverted;
  });

  describe("grant minter and admin role", function () {
    beforeEach(async function () {
      await this.plines.grantRole(await this.plines.MINTER_ROLE(), this.grantedAdmin.address);
      await this.plines.grantRole(await this.plines.DEFAULT_ADMIN_ROLE(), this.grantedAdmin.address);
    });

    it("tokenURI reverts if requested URI query for nonexistent token", async function () {
      await expect(this.plines.connect(this.provider).tokenURI(1)).to.be.reverted;
    });

    it("tokenURI reverts if mintId more than maxTotalSupply", async function () {
      await expect(this.plines.connect(this.grantedAdmin).mint(this.other.address, 17000)).to.be.revertedWith(
        "mintIndex > maxTotalSupply"
      );
    });

    it("tokenURI reverts if mintMultiple 0 tokens", async function () {
      await expect(this.plines.connect(this.grantedAdmin).mintMultiple(this.other.address, 0)).to.be.revertedWith(
        "nfts cannot be 0"
      );
    });

    it("totalSupply equal 0", async function () {
      expect(await this.plines.connect(this.grantedAdmin).totalSupply()).to.be.equal(0);
    });

    describe("mint first token", function () {
      beforeEach(async function () {
        await this.plines.connect(this.grantedAdmin).mint(this.other.address, 0);
      });

      it("zero token has tokenURI '/0.json' after its mint", async function () {
        expect(await this.plines.connect(this.grantedAdmin).tokenURI(0)).to.be.equal("/0.json");
      });

      describe("set default uri", function () {
        beforeEach(async function () {
          await this.plines.setBaseUri("URI");
        });

        it("zero token has tokenURI 'URI/0.json' after its mint", async function () {
          expect(await this.plines.connect(this.grantedAdmin).tokenURI(0)).to.be.equal("URI/0.json");
          await expect(this.plines.connect(this.grantedAdmin).tokenURI(1)).to.be.revertedWith(
            "URI query for nonexistent token"
          );
        });
      });
    });

    describe("mintMultiple 20 tokens", function () {
      beforeEach(async function () {
        await this.plines.connect(this.grantedAdmin).mintMultiple(this.other.address, 20);
      });

      it("totalSupply equal 20 after mintMultiple 20 tokens", async function () {
        expect(await this.plines.connect(this.grantedAdmin).totalSupply()).to.be.equal(20);
      });
    });
  });

  describe("with granted DEFAULT_ADMIN_ROLE", function () {
    beforeEach(async function () {
      await this.plines.grantRole(await this.plines.DEFAULT_ADMIN_ROLE(), this.grantedAdmin.address);
    });

    it("setBaseUri succeeds and fails after revocation", async function () {
      await this.plines.connect(this.grantedAdmin).setBaseUri("ipfs://ipfs/newURI");
      await this.plines.revokeRole(await this.plines.DEFAULT_ADMIN_ROLE(), this.grantedAdmin.address);
      await expect(this.plines.connect(this.grantedAdmin).setBaseUri("ipfs://ipfs/newestURI")).to.be.reverted;
    });
  });
});
