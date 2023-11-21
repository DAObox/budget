<h1 align="center">DAOBox - Budget</h1>

<p align="center">
  <img src="./assets/banner.png" alt="daobox-banner" />
  <br>
  <i>DAOBox - Budget is an Aragon OSx Plugin that allows the execution of payments bypassing the need for regular voting.</i>
  <br>
</p>

<p align="center">
  <a href="https://github.com/DAObox/budget/actions"><img src="https://github.com/DAObox/budget/actions/workflows/ci.yml/badge.svg" alt="Github Actions"></a>
  <a href="https://getfoundry.sh/"><img src="https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg" alt="Foundry"></a>
  <a href="https://opensource.org/license/agpl-v3/"><img src="https://img.shields.io/badge/License-AGPL-blue.svg" alt="License: AGPL-3-0"></a>
  <a href="https://use-aragon.daobox.app"><img src="https://img.shields.io/badge/Docs-DAOBox-blue.svg" alt="Docs"></a>
  <a href="https://discord.gg/d5nCgVt4kE"><img alt="Discord" src="https://img.shields.io/discord/1019114018545352734"></a>

</p>

<hr>

[gha]: https://github.com/DAObox/budget/actions
[gha-badge]: https://github.com/DAObox/budget/actions/workflows/ci.yml/badge.svg
[foundry]: https://getfoundry.sh/
[foundry-badge]: https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg
[license]: https://opensource.org/license/agpl-v3/
[license-badge]: https://img.shields.io/badge/License-AGPL-blue.svg

<br />

## Overview

Budget is an Aragon OSx Plugin that allows the execution of payments bypassing the need for regular voting. Authorized
entities can directly perform payments using the DAO's funds if they are within the spending allowance of a specific
budget. This primitive empowers agents in the _Orginasation_ with the _Autonomy_ to make spending decitions, while at the same
time ensuring accountability, transparency, and strong security

## Project

The root folder of the repo includes three subfolders:

```markdown
.
├── packages/contracts
│ ├── src
│ ├── ...
│ └── package.json
│
├── packages/hooks
│ ├── src
│ ├── ...
│ └── package.json
│
├── ...
└── package.json
```

## Contracts

```sh
$ cd packages/budget
$ forge install
$ pnpm install # install Solhint, Prettier, and other Node.js deps
$ pnpm test
```

If this is your first time with Foundry, check out the
[installation](https://github.com/foundry-rs/foundry#installation) instructions.

<br />

## Contracts Overview

Budget is an Aragon OSx Plugin that allows the execution of payments bypassing the need for regular voting. Authorized
entities can directly perform payments using the DAO's funds if they are within the spending allowance of a specific
budget.

Budget uses natural dates (e.g. an allowance can restart the first day of the month) instead of timestamps (e.g. an
allowance restarts every `30 * 24 * 3600` seconds) for UX purposes as most business dates revolve around schelling
points that are unequal amounts of seconds apart (months, quarters, years).

Budget allows spenders of an allowance (which can only be granted by the DAO itself, more on this below) to create an
arbitrary number of sub-allowances from which another set of spenders can spend (and recursively create other
sub-allowances as well)

It can be used with a role-based permissioning system which allows to authorize groups within the company to spend from
a particular allowance (e.g. executives role or operations team role). This enables an easier onboarding/offboarding
process (i.e. granting someone one role immediately allows them to spend from all the allowances that the role is the
authorized spender).

<br />

## Lifecycle

<br />

### Creating allowances

The allowance is the main data structure/primitive that Budget is built around. They are created with this function:

```typescript
function createAllowance(
        uint256 parentAllowanceId,
        address spender,
        address token,
        uint256 amount,
        EncodedTimeShift recurrency,
        string memory name
) public returns (uint256 allowanceId);
```

Allowances can have any number of sub-allowances, effectively forming a tree of allowances. Top-level allowances are
allowances that aren’t a sub-allowance of any other allowance. Only the DAO itself can create top-level allowances; as
they aren’t bound by the controls of a parent allowance, they could potentially spend all the DAO’s assets if the
allowance parameters allowed so.

The parameters that an allowance has are:

- Parent allowance ID: which allowance this allowance belongs to. This will be zero in case of a top-level allowance. It
  can’t be modified after creation.

- Spender address: address of the EoA or Contract authorized to trigger payments from the allowance.

- Token: address of the token contract or flag for the native asset that this allowance will spend. It can’t be modified
  after creation and can only be decided for top-level allowances as all sub-allowances below it must use the same
  token.

- Amount: amount of token in its smallest unit (e.g. wei amount for ETH) that can be spent from this allowance per
  period.

- Recurrency: cadence with which the spent amount in the allowance is reset to zero. It can’t be modified after
  creation.

- Name: human readable name for the allowance being created

#### Recurrency

The recurrency of an allowance is defined with a data structure we call `TimeShift` . A `TimeShift` is comprised of the
following two fields:

1. **Time unit**: specifies when the amount spent in the allowance will be reset to zero, allowing to spend the full
   amount of the allowance again. Options:

   - **Daily**: resets every day at midnight UTC.
   - **Weekly**: resets every Monday at midnight UTC (Monday is considered the first day of the week, and can be
     modified with an offset).
   - **Monthly**: resets the first day of every month at midnight UTC.
   - **Quarterly**: resets the first day of every quarter (Jan 1st, Apr 1st, Jul 1st, Oct 1st) at midnight UTC.
   - **Semiyearly**: resets on Jan 1st and Jul 1st at midnight UTC.
   - **Yearly**: resets on Jan 1st at midnight UTC.
   - Non-time units:
   - **Non-recurrent**: never resets, uses offset value as the date until which the allowance will become inactive.
     Useful to create time-bounced one-time allowances.
   - **Inherit**: flags that the allowance has the same recurrency as its parent (see more on [Parameter inheritance]())

2. **Offset**: delta in seconds to UTC to offset time calculations. This is useful for both handling timezones (e.g.
   daily allowance which resets at midnight in UTC+2 would have an offset of `+2 * 60 * 60`) and exact moments in time
   (e.g. an allowance that resets the last day of the month would have an offset of `-24 * 60 * 60`)

The recurrency argument of `Budget.createAllowance(...)` takes a `EncodedTimeShift` value which is a custom type over a
`bytes6` value. The first byte is the encoded time unit and the next 5 are a `int40` for the offset. You can see more
about the encoding/decoding [here]().

#### Sub-allowances

In order to create a sub-allowance, an account must be allowed to make payments from that particular allowance (it’s
address is the spender or has the concrete role). Sub-allowances are created to bucket spending within a larger
allowance and grant spending permissions to another set of accounts. The creator of a sub-allowance has full freedom to
set any parameters for it (except for the token address which must be the same as its parent’s), but it will always be
bound by the limits of its parent. When spending from a sub-allowance, the amount of the payment is credited not only
its own authorized amount, but from the authorized amount of its parent and all ancestors in the chain until getting to
the top-level allowance.

Some peculiarities of sub-allowances:

- Their recurrency can be different from the parent’s in both directions. It is possible to have a monthly sub-allowance
  under both a weekly or yearly parent allowance.
- The amount of a sub-allowance can be greater than the parent, but since spending controls are applied recursively, a
  sub-allowance will never be able to spend more than any of its ancestors allow
- Since allowances can be paused or disabled temporarily, pausing an allowance will effectively disable spending from
  its descendants. All ancestor allowances in the chain to its top-level allowances must be enabled for a sub-allowance
  to be able to spend.

#### Parameter inheritance

Keeping the allowance primitive simple came with a few short-comings (e.g. a single spender, not modifiable recurrency).
These are tolerable because most goals can be achieved with sub-allowances (e.g. adding a spender can be done creating a
sub-allowance for the same amount).

Because of how Budget tracks spending at the level of each individual allowance, the use of a deep tree of
sub-allowances could become expensive gas wise. This is why we allow for inheriting certain parameters from a parent
allowance, which stops the sub-allowance from tracking them itself and just relying on them being checked up the chain
(multiple levels of recurrency are allowed).

- **Inheriting recurrency**: a sub-allowance can inherit the recurrency of its parent, reseting its spent amount
  whenever its parent amount is reset. This can be used to create buckets of spending which are tracked using the same
  time unit (e.g. a yearly general budget which has sub-budgets for different departments).
- **Inheriting amount**: a sub-allowance which inherits the recurrency of its parent can also be set to inherit its
  amount. This effectively means that the sub-allowance doesn’t keep track of how much it has been spent through it and
  just uses its parent spent amount. This is useful to authorize additional accounts to spend from a particular
  allowance while still keeping control over it.

<br />

### Executing payments

The authorized spender for an allowance can use
`Budget:executePayment(uint256 allowanceId, address to, uint256 amount, string description)` or
`Budget:executeMultiPayment(uint256 allowanceId, address[] tos, uint256[] amounts, string description)` to trigger a
payment from the DAO to the specified address of an amount if and only if it is within the spending limit.

When performing a payment, the contract will check whether the allowance (and all its ancestors) need to have their
spent amount reset according to their recurrency and will calculate when it will reset next.

<br />

### Debiting payments

It is possible to use `Budget:debitAllowance(uint256 allowanceId, uint256 amount, bytes description)` to return a
certain amount of tokens (e.g. some funds are returned from a payment) and remove that amount from the spent amount for
the period.

Any account can debit a payment to a particular allowance if those tokens can be successfully deposited from the account
triggering the debit to the DAO.

Debiting payments only has an effect towards the current period and the spent amount for the allowance can never go
negative (meaning at no time it is possible to spend from an allowance more than its amount)

<br />

## Security considerations

<br />

### Unbounded allowance recursion

As evident from the above, an infinite chain of sub-allowances can be created. When spending from an allowance at depth
`N` , there’s an unbounded recursive function (`_checkAndUpdateAllowanceChain`) which checks and modifies storage for
all levels in the allowance chain until it reaches its top-level allowance.

For a Solidity program, this is certainly a fat red flag as things like this can lead to gas griefing attacks or locking
the contract making the gas cost to operate something go over the limit. However, there are a few reasons why due to the
constraints of this system, this is a non-issue:

- **Anti-griefing**: even though any spender of an allowance can create sub-allowances with custom parameters (and
  therefore being able to create an ‘infinite’ chain below any allowance in which they are a spender), this doesn’t
  impact the gas required to interact with its sibling or ancestor sub-allowances.

- **Contract locking due to forcing gas limit**: similarly to the one above, even though it is possible to end up
  creating a sub-allowance at such depth that it is impossible to execute or debit payments to it, the issue will be
  localized to those specific allowances the bad actor is creating.

- **Infinite loops**: as the parent of a sub-allowance has to exist when it is created and it cannot be changed, it is
  impossible to form a loop in which a sub-allowance can have itself in its ancestry.

<br />

## License

This project is licensed under AGPL-3.0-or-later
