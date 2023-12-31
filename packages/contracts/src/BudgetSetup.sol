// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity 0.8.17;

import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";

import { PluginSetup, IPluginSetup } from "@aragon/osx/framework/plugin/setup/PluginSetup.sol";
import { IDAO } from "@aragon/osx/core/dao/IDAO.sol";
import { DAO } from "@aragon/osx/core/dao/DAO.sol";
import { PermissionLib } from "@aragon/osx/core/permission/PermissionLib.sol";
import { Budget } from "./Budget.sol";

contract BudgetSetup is PluginSetup {
    using Clones for address;

    /// @notice The address of `Budget` plugin logic contract to be cloned.
    address private immutable IMPLEMENTATION;

    /// @notice The constructor setting the `Budget` implementation contract to clone from.
    constructor() {
        IMPLEMENTATION = address(new Budget());
    }

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes calldata _data
    )
        external
        returns (address plugin, PreparedSetupData memory preparedSetupData)
    {
        (_data); // Avoids warnings for unused variables.

        // Clone plugin contract.
        plugin = IMPLEMENTATION.clone();

        // Initialize cloned plugin contract.
        Budget(plugin).initialize(IDAO(_dao));

        // Prepare permissions
        PermissionLib.MultiTargetPermission[] memory permissions = new PermissionLib.MultiTargetPermission[](2);

        // Grant `ROOT_BUDGET_PERMISSION_ID` of the Plugin to the DAO.
        permissions[0] = PermissionLib.MultiTargetPermission(
            PermissionLib.Operation.Grant,
            plugin,
            _dao,
            PermissionLib.NO_CONDITION,
            Budget(plugin).ROOT_BUDGET_PERMISSION_ID()
        );

        // Grant `EXECUTE_PERMISSION` on the DAO to the plugin.
        permissions[1] = PermissionLib.MultiTargetPermission(
            PermissionLib.Operation.Grant,
            _dao,
            plugin,
            PermissionLib.NO_CONDITION,
            DAO(payable(_dao)).EXECUTE_PERMISSION_ID()
        );

        preparedSetupData.permissions = permissions;
    }

    /// @inheritdoc IPluginSetup
    function prepareUninstallation(
        address _dao,
        SetupPayload calldata _payload
    )
        external
        view
        returns (PermissionLib.MultiTargetPermission[] memory permissions)
    {
        // Prepare permissions
        permissions = new PermissionLib.MultiTargetPermission[](1);

        permissions[0] = PermissionLib.MultiTargetPermission(
            PermissionLib.Operation.Revoke,
            _dao,
            _payload.plugin,
            PermissionLib.NO_CONDITION,
            DAO(payable(_dao)).EXECUTE_PERMISSION_ID()
        );
    }

    /// @inheritdoc IPluginSetup
    function implementation() external view returns (address) {
        return IMPLEMENTATION;
    }
}
