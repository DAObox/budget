import { useAccount } from "wagmi";

import { useStore } from ".";
import { useQuery } from "@tanstack/react-query";
import { tokenVotingClient } from "../service/aragon";
import { TokenVotingMember } from "@aragon/sdk-client";

export function useIsTokenVotingMember() {
  const { tokenVotingAddress } = useStore();
  const { address } = useAccount();
  const { data: isMember, ...rest } = useQuery({
    queryKey: ["isMember", tokenVotingAddress, address],
    queryFn: async () =>
      tokenVotingClient.methods.getMembers({
        pluginAddress: tokenVotingAddress!,
      }),
    enabled: !!(tokenVotingAddress && address),
    select(data: Array<TokenVotingMember>) {
      console.log(data);
      console.log(address);
      if (address === undefined) return false;
      return data.some(
        (member) =>
          member.address.toLowerCase() === address.toLowerCase() ||
          member.delegators.some((delegator) => delegator.address.toLowerCase() === address.toLowerCase()),
      );
    },
  });
  return { isMember, ...rest };
}
