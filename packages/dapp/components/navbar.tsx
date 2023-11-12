"use client";

import { Navbar as NextUINavbar, NavbarContent } from "@nextui-org/navbar";
import { Badge, User } from "@nextui-org/react";

import { Button } from "@nextui-org/button";
import NextLink from "next/link";

import { NotificationIcon } from "@/components/icons";
import { useDynamicContext } from "./dynamic";

export const Navbar = () => {
  const { setShowAuthFlow } = useDynamicContext();

  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="p-3">
      <NavbarContent justify="start">
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <User
            as="button"
            onClick={() => setShowAuthFlow(true)}
            name="Aaron Abu Usama"
            description="abuusama.eth"
            className="transition-transform"
            avatarProps={{
              src: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
              isBordered: true,
              radius: "full",
            }}
          />
        </NextLink>
      </NavbarContent>

      <NavbarContent justify="end">
        <Badge content="9+" shape="circle" color="danger">
          <Button
            radius="full"
            isIconOnly
            aria-label="more than 9 notifications"
            variant="light"
          >
            <NotificationIcon size={24} />
          </Button>
        </Badge>
      </NavbarContent>
    </NextUINavbar>
  );
};
