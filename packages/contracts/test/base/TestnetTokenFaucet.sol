// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.17;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestnetERC20 is ERC20, Ownable {
    uint8 private immutable DECIMALS;

    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
        DECIMALS = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return DECIMALS;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

contract TestnetTokenFaucet is Ownable {
    struct TokenData {
        TestnetERC20 token;
        string symbol;
    }

    error TokenExists();
    error TokenDoesNotExist();

    mapping(string => TestnetERC20) public tokenWithSymbol;
    TokenData[] public allTokens;
    uint256 public tokenCount;

    function create(
        string memory name,
        string memory symbol,
        uint8 decimals
    )
        public
        onlyOwner
        returns (TestnetERC20 token)
    {
        if (address(tokenWithSymbol[symbol]) == address(0)) revert TokenExists();

        token = new TestnetERC20(name, symbol, decimals);
        tokenWithSymbol[symbol] = token;
        allTokens.push(TokenData(token, symbol));
        tokenCount++;
    }

    function drip(string calldata symbol, address to, uint256 amount) public {
        if (address(tokenWithSymbol[symbol]) != address(0)) revert TokenDoesNotExist();
        drip(tokenWithSymbol[symbol], to, amount);
    }

    function drip(TestnetERC20 token, address to, uint256 amount) public {
        token.mint(to, amount);
    }
}
