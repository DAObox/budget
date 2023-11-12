import Image from "next/image";
import React, { ReactNode, useState } from "react";

import Tokens from "./reserveTokens.json";
import clsx from "clsx";
const tokens = Tokens.tokens;

export const getIconBackgroundColor = (symbol?: string): string => {
  const symbolLowerCase = symbol?.toLowerCase() as string;

  return symbolLowerCase === "gno"
    ? "bg-blue-900"
    : symbolLowerCase === "weth"
    ? "bg-black"
    : symbolLowerCase === "wxdai"
    ? "bg-green-700"
    : symbolLowerCase === "dai"
    ? "bg-yellow-400"
    : symbolLowerCase === "xdai"
    ? "bg-green-700"
    : symbolLowerCase === "usdc"
    ? "bg-blue-600"
    : symbolLowerCase === "wbtc"
    ? "bg-orange-500"
    : symbolLowerCase === "usdt"
    ? "bg-green-500"
    : symbolLowerCase === "link"
    ? "bg-blue-600"
    : symbolLowerCase === "fox"
    ? "bg-gray-800"
    : symbolLowerCase === "agve"
    ? "bg-white"
    : symbolLowerCase === "eure"
    ? "bg-blue-500"
    : symbolLowerCase === "wsteth"
    ? "bg-gray-200"
    : symbolLowerCase === "sdai"
    ? "bg-green-800"
    : "bg-green-600";
};

interface Props {
  dimensions?: number;
  symbol: string;
}

export const TokenIcon: React.FC<Props> = ({
  dimensions = 18,
  symbol,
  ...restProps
}) => {
  const [error, setError] = useState(false);
  const token = tokens.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  );
  const tokenImage = token?.logoURI;
  const offset = token?.offset ?? 10;
  const backgroundColor = getIconBackgroundColor(symbol);

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full",
        backgroundColor,
      )}
      style={{
        height: `${dimensions}px`,
        width: `${dimensions}px`,
      }}
      title={symbol}
      {...restProps}
    >
      {tokenImage && !error ? (
        <Image
          alt={symbol}
          className="tokenIcon"
          height={dimensions - offset}
          onError={() => setError(true)}
          src={tokenImage}
          width={dimensions - offset}
        />
      ) : (
        <div className="text-white text-xs font-bold uppercase">
          {symbol[0]}
        </div>
      )}
    </div>
  );
};

interface IconProps {
  symbol: string;
  children: ReactNode;
  className?: string;
}
export const Icon: React.FC<IconProps> = ({ symbol, children, className }) => {
  const backgroundColorClass = getIconBackgroundColor(symbol);

  return (
    <div
      className={clsx(
        `flex items-center w-20 h-20 justify-center flex-shrink-0 transition-colors duration-200 ease-linear rounded-3xl`,
        backgroundColorClass,
        className,
      )}
      // style={{
      //   height: "68px",
      //   width: "68px",
      // }}
    >
      {children}
    </div>
  );
};
