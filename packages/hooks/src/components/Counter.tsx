import { useNetwork, useWaitForTransaction } from "wagmi";
import { useInstallBudget, useInstallProposal, usePrepareInstall } from "../lib/useInstallBudget";

export function Counter() {
  return (
    <div>
      <h1>Budget</h1>
      <InstallPlugin />
      {/* <Count />
      <SetNumber />
      <Increment /> */}
    </div>
  );
}

function InstallPlugin() {
  const { installPlugin, prepareTxHash, prepareTxReceipt, installTxReceipt, installTxHash, error, isLoading } =
    useInstallBudget({
      daoAddress: "0xce780fea1c950a29769b4f10817a9c51154d12af",
      budgetRepoAddress: "0x9b72Af17B8aE55AE2F3C06E46A44D9bEaFb10801",
      pluginSetupProcessorAddress: "0xE8B5d8D66a02CD1b9Bd32a4064D7ABa45F51305e",
      tokenVotingAddress: "0xC41e25D5e7Cf5457b635D94c2262F914bb9d36E8",
    });

  let buttonText;
  switch (true) {
    case isLoading && !prepareTxHash && !installTxHash:
      buttonText = "Submitting preparation...";
      break;
    case isLoading && !!prepareTxHash && !installTxHash:
      buttonText = "Waiting for preparation confirmation...";
      break;
    case isLoading && !!prepareTxHash && !!installTxHash:
      buttonText = "Submitting installation...";
      break;
    case !isLoading && prepareTxReceipt && !installTxReceipt:
      buttonText = "Installation Prepared";
      break;
    case !!installTxReceipt:
      buttonText = "Budgets Installed";
      break;
    default:
      buttonText = "Install Plugin";
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button onClick={() => installPlugin?.()} disabled={isLoading || !!installTxReceipt}>
          {buttonText}
        </button>
        {prepareTxHash && <ProcessingMessage hash={prepareTxHash?.hash} name="Prepare Install" />}
        {installTxHash && <ProcessingMessage hash={installTxHash?.hash} name="Install Plugin" />}
        {error && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
}

// function InstallPlugin() {
//   const {
//     prepareTxHash,
//     txReceipt: prepareTxReceipt,
//     error: prepareError,
//     isLoading: isPrepareLoading,
//     installAction,
//     plugin,
//     prepareInstallation,
//   } = usePrepareInstall({
//     daoAddress: "0xce780fea1c950a29769b4f10817a9c51154d12af",
//     budgetRepoAddress: "0x9b72Af17B8aE55AE2F3C06E46A44D9bEaFb10801",
//     pluginSetupProcessorAddress: "0xE8B5d8D66a02CD1b9Bd32a4064D7ABa45F51305e",
//   });

//   const {
//     error: installError,
//     installProposal,
//     installTxHash,
//     isLoading: isInstallLoading,
//     txReceipt: installTxReceipt,
//   } = useInstallProposal({
//     installAction,
//     daoAddress: "0xce780fea1c950a29769b4f10817a9c51154d12af",
//     pluginSetupProcessorAddress: "0xE8B5d8D66a02CD1b9Bd32a4064D7ABa45F51305e",
//     tokenVotingAddress: "0xC41e25D5e7Cf5457b635D94c2262F914bb9d36E8",
//     enabled: !!prepareTxReceipt,
//   });

//   let prepareButtonText = "Prepare Installation";
//   if (isPrepareLoading) prepareButtonText = prepareTxHash ? "Waiting for confirmation..." : "Submitting transaction...";
//   else if (prepareTxReceipt) prepareButtonText = "Installation Prepared";

//   let installButtonText = "Install Proposal";
//   if (isInstallLoading) installButtonText = installTxHash ? "Waiting for confirmation..." : "Submitting transaction...";
//   else if (installTxReceipt) installButtonText = "Budgets Installed";

//   return (
//     <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
//       <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//         <button
//           onClick={() => prepareInstallation?.()}
//           disabled={isPrepareLoading || !prepareInstallation || !!prepareTxReceipt}
//         >
//           {prepareButtonText}
//         </button>
//         {prepareTxHash && <ProcessingMessage hash={prepareTxHash?.hash} name="Prepare Install" />}
//         {prepareError && <div>Error: {prepareError.message}</div>}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//         <button
//           onClick={() => installProposal?.()}
//           disabled={isInstallLoading || !!installTxReceipt || !installProposal}
//         >
//           {installButtonText}
//         </button>
//         {installTxHash && <ProcessingMessage hash={installTxHash?.hash} name="Install proposal" />}
//         {installError && <div>Error: {installError.message}</div>}
//       </div>
//     </div>
//   );
// }

function ProcessingMessage({ hash, name }: { hash?: `0x${string}`; name: string }) {
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

// function Count() {
//   const { data: count } = useCounterNumber()
//   return <div>Count: {count?.toString()}</div>
// }

// function SetNumber() {
//   const [value, setValue] = useState('')

//   const { config } = usePrepareCounterSetNumber({
//     args: value ? [BigInt(value)] : undefined,
//     enabled: Boolean(value),
//   })
//   const { data, write } = useCounterSetNumber({
//     ...config,
//     onSuccess: () => setValue(''),
//   })

//   const { refetch } = useCounterNumber()
//   const { isLoading } = useWaitForTransaction({
//     hash: data?.hash,
//     onSuccess: () => refetch(),
//   })

//   return (
//     <div>
//       Set Number:
//       <input
//         disabled={isLoading}
//         onChange={(e) => setValue(e.target.value)}
//         value={value}
//       />
//       <button disabled={!write || isLoading} onClick={() => write?.()}>
//         Set
//       </button>
//       {isLoading && <ProcessingMessage hash={data?.hash} />}
//     </div>
//   )
// }

// function Increment() {
//   const { config } = usePrepareCounterIncrement()
//   const { data, write } = useCounterIncrement(config)

//   const { refetch } = useCounterNumber()
//   const { isLoading } = useWaitForTransaction({
//     hash: data?.hash,
//     onSuccess: () => refetch(),
//   })

//   return (
//     <div>
//       <button disabled={!write || isLoading} onClick={() => write?.()}>
//         Increment
//       </button>
//       {isLoading && <ProcessingMessage hash={data?.hash} />}
//     </div>
//   )
// }
