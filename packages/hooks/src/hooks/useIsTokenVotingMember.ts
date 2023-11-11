import request, { gql } from "graphql-request";
import { BytesLike } from "../types";
import { useQuery } from "@tanstack/react-query";
import { subgraph } from "../lib/constants";
import { useStore } from "./useStore";
import { useBlockNumber } from "wagmi";

export const QueryTokenVotingIsMember = gql`
  query TokenVotingIsMember($id: ID!, $block: Block_height) {
    tokenVotingMember(id: $id, block: $block) {
      id
    }
  }
`;

export const useIsTokenVotingMember = ({ address }: { address: BytesLike | undefined }) => {
  const { data: blockNumber } = useBlockNumber();
  const { tokenVotingAddress } = useStore();
  console.log({ blockNumber, tokenVotingAddress, address });

  const { data: isMember } = useQuery({
    queryKey: ["tokenVotingMember", address, blockNumber?.toString()],
    queryFn: async () =>
      request(subgraph, QueryTokenVotingIsMember, {
        id: `${tokenVotingAddress?.toLocaleLowerCase()}_${address?.toLowerCase()}`,
        blockNumber: { number: blockNumber?.toString() },
      }),
    enabled: !!(address && blockNumber && tokenVotingAddress),
  });

  console.log({ isMember });
  return !!isMember;
};
