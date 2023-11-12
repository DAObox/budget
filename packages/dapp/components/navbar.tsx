"use client";

import { Navbar as NextUINavbar, NavbarContent } from "@nextui-org/navbar";
import { Badge, User } from "@nextui-org/react";

import { Button } from "@nextui-org/button";

import { NotificationIcon } from "@/components/icons";
import { DynamicUserProfile, useDynamicContext } from "./dynamic";

export const Navbar = () => {
  const { setShowDynamicUserProfile } = useDynamicContext();

  return (
    <NextUINavbar maxWidth="sm" position="sticky" className="p-2">
      <NavbarContent justify="start">
        <User
          as="button"
          onClick={() => setShowDynamicUserProfile(true)}
          name="Aaron Abu Usama"
          description="abuusama.eth"
          className="transition-transform"
          avatarProps={{
            src: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
            isBordered: true,
            radius: "full",
          }}
        />
        <DynamicUserProfile />
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
