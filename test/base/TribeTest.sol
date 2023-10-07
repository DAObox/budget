// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.17;

import "forge-std/Test.sol";

contract TribeTest is Test {
    function account(string memory label) internal returns (address addr) {
        (addr,) = accountAndKey(label);
    }

    function accountAndKey(string memory label) internal returns (address addr, uint256 pk) {
        pk = uint256(keccak256(abi.encodePacked(label)));
        addr = vm.addr(pk);
        vm.label(addr, label);
    }

    function timetravel(uint256 time) internal {
        vm.warp(block.timestamp + time);
    }

    function blocktravel(uint256 blocks) internal {
        vm.roll(block.number + blocks);
    }
}
