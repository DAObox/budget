import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useStore } from ".";
import { subgraph } from "../lib/constants";
import { BytesLike } from "../types";

const getPlugins = async ({ daoAddress, subgraph }: { daoAddress: BytesLike; subgraph: string }): Promise<DaoData> => {
  const query = gql`
    query GetInstalledPlugins($daoAddress: ID!) {
      dao(id: $daoAddress) {
        plugins(where: { state: Installed }) {
          appliedPreparation {
            pluginAddress
          }
          appliedPluginRepo {
            subdomain
          }
        }
      }
    }
  `;

  const data = await request<DaoData>(subgraph, query, { daoAddress });
  return data;
};

interface Plugin {
  appliedPreparation: {
    pluginAddress: string;
  };
  appliedPluginRepo: {
    subdomain: string;
  };
}

interface DaoData {
  dao: {
    plugins: Plugin[];
  };
}

export const useGetPlugin = (subdomain: string) => {
  const { daoAddress } = useStore();
  const { data: plugin, ...rest } = useQuery({
    queryKey: ["plugin", daoAddress, subdomain],
    queryFn: () => getPlugins({ daoAddress: daoAddress!, subgraph }),
    select(data) {
      const pluginWithSubdomain = data.dao.plugins.find(
        (plugin) => plugin.appliedPluginRepo.subdomain === subdomain.toLowerCase(),
      );
      return pluginWithSubdomain
        ? {
            pluginAddress: pluginWithSubdomain.appliedPreparation.pluginAddress as BytesLike,
            subdomain: pluginWithSubdomain.appliedPluginRepo.subdomain,
          }
        : null;
    },
    enabled: !!(daoAddress && subgraph && subdomain),
  });
  return { plugin, ...rest };
};
