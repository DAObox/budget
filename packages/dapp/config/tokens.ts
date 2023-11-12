const tokens = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
    decimals: 6,
    chainId: 100,
    logoURI: "/coins/usdc.svg",
    offset: 0,
    extensions: {
      isNative: false,
      isNativeWrapper: false,
    },
  },
  {
    symbol: "WETH",
    name: "WETH",
    address: "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    decimals: 18,
    chainId: 100,
    logoURI: "/coins/eth.svg",
    offset: 60,
    extensions: {
      isNative: false,
      isNativeWrapper: false,
    },
  },
  {
    symbol: "wstETH",
    name: "Wrapped liquid staked Ether 2.0 from Mainnet",
    address: "0x6c76971f98945ae98dd7d4dfca8711ebea946ea6",
    decimals: 18,
    chainId: 100,
    logoURI: "/coins/wsteth.svg",
    offset: 22,
    extensions: {
      isNative: false,
      isNativeWrapper: false,
    },
  },
  {
    symbol: "USDT",
    name: "Tether USD on xDai",
    address: "0x4ecaba5870353805a9f068101a40e0f32ed605c6",
    decimals: 6,
    chainId: 100,
    logoURI: "/coins/usdt.svg",
    offset: 12,
    extensions: {
      isNative: false,
      isNativeWrapper: false,
    },
  },
  {
    symbol: "EURe",
    name: "Monerium EUR emoney",
    address: "0xcB444e90D8198415266c6a2724b7900fb12FC56E",
    decimals: 18,
    chainId: 100,
    logoURI: "/coins/eure.svg",
    offset: 10,
    extensions: {
      isNative: false,
      isNativeWrapper: false,
    },
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x8e5bbbb09ed1ebde8674cda39a0c169401db4252",
    decimals: 8,
    chainId: 100,
    logoURI: "/coins/wbtc.svg",
    offset: 0,
    extensions: {
      isNative: false,
      isNativeWrapper: false,
    },
  },
] as const;

export default tokens;
