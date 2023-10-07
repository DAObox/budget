// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.17;

import { PluginUUPSUpgradeable, IDAO } from "@aragon/osx/core/plugin/PluginUUPSUpgradeable.sol";

/**
 * @title Budget
 * @author DAOBox (Security@DAOBox.app)
 * @notice Budgeting module for efficient spending from an Aragon OSx DAO using allowance chains
 * to delegate spending authority
 */
contract Budgets is PluginUUPSUpgradeable {
    uint256 public number;

    /// @notice Initializes the plugin when build 1 is installed.
    function initializeBuild(IDAO _dao, uint256 _number) external initializer {
        __PluginUUPSUpgradeable_init(_dao);
        number = _number;
    }
}
