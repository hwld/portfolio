import {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import EggIcon from "../images/icons/egg.png";
import HinaIcon from "../images/icons/hina.png";

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

export const Egg: React.VFC<
  { className?: string } & ComponentPropsWithoutRef<"img">
> = ({ className, ...props }) => {
  const { isEgg } = useEggState();
  const imageUrl = useMemo(() => {
    return isEgg ? EggIcon : HinaIcon;
  }, [isEgg]);
  return (
    <img
      src={imageUrl}
      className={`pointer-events-none select-none ${className}`}
      {...props}
    />
  );
};

export const EggOrigin: React.VFC<{ className?: string }> = ({ className }) => {
  const { toggleEggState } = useEggState();
  return (
    <div onClick={toggleEggState}>
      <Egg className={`cursor-pointer ${className}`} />
    </div>
  );
};
