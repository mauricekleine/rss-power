import { createContext, useContext } from "react";

const CardContext = createContext({ isInactive: false });

export const useCardContext = () => {
  const context = useContext(CardContext);

  if (context === undefined) {
    throw new Error("useCardContext must be used within a CardContext");
  }

  return context;
};

export const CardContextProvider = CardContext.Provider;

export default CardContext;
