import { FC, PropsWithChildren, createContext, useContext, useReducer } from "react";
import { BytesLike } from "../types";

interface GlobalState {
  daoAddress: BytesLike | undefined;
  tokenVotingAddress: BytesLike | undefined;
  budgetAddress: BytesLike | undefined | null;
  activeBudget: string | undefined;
}

type Action =
  | { type: "SET_DAO_ADDRESS"; payload: BytesLike }
  | { type: "SET_TOKEN_VOTING_ADDRESS"; payload: BytesLike }
  | { type: "SET_BUDGET_ADDRESS"; payload: BytesLike }
  | { type: "SET_ACTIVE_BUDGET"; payload: string };

const globalStateReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "SET_DAO_ADDRESS":
      return { ...state, daoAddress: action.payload };
    case "SET_TOKEN_VOTING_ADDRESS":
      return { ...state, tokenVotingAddress: action.payload };
    case "SET_BUDGET_ADDRESS":
      return { ...state, budgetAddress: action.payload };
    case "SET_ACTIVE_BUDGET":
      return { ...state, activeBudget: action.payload };
    default:
      return state;
  }
};

interface GlobalStateContextType extends GlobalState {
  dispatch: React.Dispatch<Action>;
  setDaoAddress: (address: BytesLike) => void;
  setTokenVotingAddress: (address: BytesLike) => void;
  setBudgetAddress: (address: BytesLike) => void;
  setActiveBudget: (budget: string) => void;
  hasVoting: boolean;
  hasBudget: boolean;
  hasDao: boolean;
}

export const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(globalStateReducer, {
    daoAddress: undefined,
    tokenVotingAddress: undefined,
    budgetAddress: undefined,
    activeBudget: undefined,
  });

  const setDaoAddress = (address: BytesLike) => dispatch({ type: "SET_DAO_ADDRESS", payload: address });
  const setTokenVotingAddress = (address: BytesLike) =>
    dispatch({ type: "SET_TOKEN_VOTING_ADDRESS", payload: address });
  const setBudgetAddress = (address: BytesLike) => dispatch({ type: "SET_BUDGET_ADDRESS", payload: address });
  const setActiveBudget = (budget: string) => dispatch({ type: "SET_ACTIVE_BUDGET", payload: budget });

  const hasVoting = Boolean(state.daoAddress);
  const hasBudget = Boolean(state.budgetAddress);
  const hasDao = Boolean(state.daoAddress);

  return (
    <GlobalStateContext.Provider
      value={{
        ...state,
        dispatch,
        setDaoAddress,
        setTokenVotingAddress,
        setBudgetAddress,
        setActiveBudget,
        hasVoting,
        hasBudget,
        hasDao,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useStore = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error("useStore must be used within a GlobalStateProvider");

  return context;
};
