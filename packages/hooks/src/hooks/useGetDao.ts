import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useStore } from ".";
import { subgraph } from "../lib/constants";
import { BytesLike } from "../types";

const getDao = async ({ daoAddress, subgraph }: { daoAddress: BytesLike; subgraph: string }): Promise<DaoData> => {
  const query = gql`
    query Dao($daoAddress: ID!) {
      dao(id: $daoAddress) {
        id
        subdomain
        metadata
        createdAt
      }
    }
  `;

  const data = await request<DaoData>(subgraph, query, { daoAddress });
  return data;
};

export interface DaoData {
  dao: {
    id: BytesLike;
    subdomain: string;
    metadata: string;
    createdAt: string;
  };
}

export const useGetDao = () => {
  const { daoAddress } = useStore();

  const { data: dao, ...rest } = useQuery({
    queryKey: ["dao", daoAddress],
    queryFn: () => getDao({ daoAddress: daoAddress!, subgraph }),
    select: (data) => {
      return {
        daoAddress: data.dao.id,
        subdomain: `${data.dao.subdomain}.dao.eth`,
        metadata: data.dao.metadata,
        createdAt: new Date(Number(data.dao.createdAt) * 1000).toLocaleString(), // Convert Unix timestamp to JavaScript Date
      };
    },
    enabled: !!(daoAddress && subgraph), // Only run this query if we have a daoAddress and subgraph
  });

  return { dao, ...rest };
};
