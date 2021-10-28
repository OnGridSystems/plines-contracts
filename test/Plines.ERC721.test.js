const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
  shouldBehaveLikeERC721Enumerable,
} = require("./behaviors/ERC721.behavior");

const PlinesMock = artifacts.require("PlinesMock");

contract("Plines ERC721", function (accounts) {
  const name = "Plines";
  const symbol = "";

  beforeEach(async function () {
    this.token = await PlinesMock.new();
    await this.token.initialize();
  });

  shouldBehaveLikeERC721("ERC721", ...accounts);
  shouldBehaveLikeERC721Metadata("ERC721", name, symbol, ...accounts);
  shouldBehaveLikeERC721Enumerable("ERC721", ...accounts);
});
