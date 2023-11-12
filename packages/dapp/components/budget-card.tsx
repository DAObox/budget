"use client";

import { Card, CardBody, Chip, Avatar, Progress } from "@nextui-org/react";
import { ClockIcon } from "@/components/icons";
import { Icon, TokenIcon } from "@/components/token-icon";
// {
//   "parentId": "0",
//   "amount": "54349902384089023",
//   "spent": "1680",
//   "token": "0x7e356025b80B220661c859d134ae12146f73f335",
//   "nextResetTime": "Sun Nov 12 2023",
//   "spender": "0x47d80912400ef8f8224531EBEB1ce8f2ACf4b75a",
//   "recurrency": "1099511627776",
//   "isDisabled": false
// }
export function BudgetCard() {
  return (
    <Card
      isBlurred
      isHoverable
      isPressable
      className="min-w-full dark:bg-default-100/50"
      shadow="sm"
    >
      <CardBody className="relative p-4 space-y-2">
        <div className="flex flex-row">
          <Icon symbol={"usdc"}>
            <TokenIcon symbol={"usdc"} dimensions={50} />
          </Icon>
          <div className="flex flex-col justify-around flex-1 mx-4">
            <Chip
              size="sm"
              variant="flat"
              avatar={
                <Avatar
                  name="JW"
                  src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
                />
              }
            >
              <p className="font-mono">alice.eth</p>
            </Chip>
            <h1 className="block w-full text-2xl font-semibold line-clamp-none">
              50,000 USDC
            </h1>
          </div>
          <div className="flex flex-col items-end justify-between ">
            <Chip
              size="sm"
              variant="faded"
              color="warning"
              startContent={<ClockIcon size={12} />}
            >
              10/10/23
            </Chip>
          </div>
        </div>
        <Progress
          label="Monthly Allowance Remaining"
          size="sm"
          value={42069}
          maxValue={50000}
          color="success"
          showValueLabel
          formatOptions={{ style: "currency", currency: "USD" }}
          className="w-full "
        />
      </CardBody>
    </Card>
  );
}
