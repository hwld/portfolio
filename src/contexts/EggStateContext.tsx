import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type EggStateContext = { isEgg: boolean; toggleEggState: () => void };

const EggStateContext = createContext<EggStateContext>({
  isEgg: true,
  toggleEggState: () => {},
});

const useEggState = () => useContext(EggStateContext);

export const EggStateContextProvider: React.VFC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [isEgg, setIsEgg] = useState(true);

  const toggleEggState = useCallback(() => {
    setIsEgg((s) => !s);
  }, []);

  return (
    <EggStateContext.Provider value={{ isEgg, toggleEggState }}>
      {children}
    </EggStateContext.Provider>
  );
};

export const Egg: React.VFC<{ className?: string }> = ({ className }) => {
  const { isEgg } = useEggState();
  return (
    <p className={`select-none duration-100 ${className}`}>
      {isEgg ? "🥚" : "🐣"}
    </p>
  );
};

export const EggOrigin: React.VFC<{ className?: string }> = ({ className }) => {
  const { toggleEggState } = useEggState();
  return (
    <p onClick={toggleEggState}>
      <Egg className={`cursor-pointer ${className}`} />
    </p>
  );
};
