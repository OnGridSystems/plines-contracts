// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../Plines.sol";

/**
 * @title ERC721Mock
 * This mock just for maxTotalSupply eq 10
 */
contract PlinesMaxTotalSupplyMock is Plines {
    function initialize() override public initializer {
        __ERC721_init("Plines", "");
        __ERC721Enumerable_init();
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        maxTotalSupply = 10;
    }
}