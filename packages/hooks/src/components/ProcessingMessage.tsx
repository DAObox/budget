import { useNetwork, useWaitForTransaction } from "wagmi";
import { BytesLike } from "../types";

export function ProcessingMessage({ hash, name }: { hash?: BytesLike; name: string }) {
  const { chain } = useNetwork();
  const etherscan = chain?.blockExplorers?.etherscan;

  const { data, isError, isLoading } = useWaitForTransaction({ hash });

  let message;
  if (isError) message = `Error occurred during ${name} transaction.`;
  else if (isLoading) message = `Waiting for ${name} transaction to be mined... `;
  else if (data) message = `${name} transaction mined.`;
  else message = `Processing ${name} transaction... `;

  return (
    <span>
      {message} {etherscan && <a href={`${etherscan.url}/tx/${hash}`}>{etherscan.name}</a>}
    </span>
  );
}
