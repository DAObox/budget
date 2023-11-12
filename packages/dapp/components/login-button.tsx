"use client";

import { UserIcon } from "@/components/icons";
import { Button } from "@nextui-org/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export function LoginButton() {
  const { setShowAuthFlow, handleLogOut, isAuthenticated } =
    useDynamicContext();

  return (
    <div className="flex flex-col w-full space-y-2">
      {!isAuthenticated ? (
        <Button
          onClick={() => setShowAuthFlow(true)}
          className=""
          size="lg"
          startContent={<UserIcon />}
        >
          Login
        </Button>
      ) : (
        <Button
          onClick={() => handleLogOut()}
          className=""
          size="lg"
          startContent={<UserIcon />}
        >
          Logout
        </Button>
      )}
    </div>
  );
}
