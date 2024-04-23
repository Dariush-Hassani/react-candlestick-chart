import React, { createContext, useContext, useReducer, Dispatch } from "react";
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from "../types/ConfigDataContextType";

const initData: ConfigDataContextType = {
  decimal: 0,
  characterFontWidth: 7.8,
  canvasWidth: 0,
  canvasHeight: 0,
  rangeSelectorRealHeight: 0,
  emptySpaceFromBottomPercent: 3 / 100,
  emptySpaceFromTopPercent: 4 / 100,
};
const ConfigDataContext = createContext<ConfigDataContextType>(initData);
const ConfigDispatchContext = createContext<Dispatch<ConfigDataActionType>>(
  () => {},
);

function dataReducer(
  state: ConfigDataContextType,
  action: ConfigDataActionType,
) {
  if (action.type === "changeDiagramDimension") {
    let newState = { ...state };
    newState.canvasHeight = action.canvasHeight;
    newState.canvasWidth = action.canvasWidth;
    newState.chartHeight = action.chartHeight;
    newState.rangeSelectorRealHeight = action.rangeSelectorRealHeight;
    return newState;
  } else if (action.type === "changeDecimal") {
    let newState = { ...state };
    newState.decimal = action.decimal;
    return newState;
  } else {
    return state;
  }
}

export const ConfigDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, dispatch] = useReducer(dataReducer, initData);

  return (
    <ConfigDataContext.Provider value={data}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigDispatchContext.Provider>
    </ConfigDataContext.Provider>
  );
};

export function useConfigData() {
  return useContext(ConfigDataContext);
}

export function useConfigDispatch() {
  return useContext(ConfigDispatchContext);
}
