import {
  DataViewerAndSelectorsActionType,
  DataViewerAndSelectorsContextType,
} from "../types/DataViewerAndSelectorsContextType";
import React, { createContext, Dispatch, useContext, useReducer } from "react";
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from "../types/ConfigDataContextType";

const initData: DataViewerAndSelectorsContextType = {
  cursorLocation: {
    x: 0,
    y: 0,
  },
  lockOnCandle: false,
};

const DataViewerAndSelectorsContext =
  createContext<DataViewerAndSelectorsContextType>(initData);
const DataViewerAndSelectorsDispatchContext = createContext<
  Dispatch<DataViewerAndSelectorsActionType>
>(() => {});

function dataViewerAndSelectorsReducer(
  state: DataViewerAndSelectorsContextType,
  action: DataViewerAndSelectorsActionType,
) {
  if (action.type === "changeLocation") {
    let newState = { ...state };
    newState.cursorLocation.x = action.x;
    newState.cursorLocation.y = action.y;
    return newState;
  } else if (action.type === "changeLockOnCandle") {
    let newState = { ...state };
    newState.lockOnCandle = action.lockOnCandle;
    return newState;
  } else {
    return state;
  }
}

export const DataViewerAndSelectorsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, dispatch] = useReducer(dataViewerAndSelectorsReducer, initData);

  return (
    <DataViewerAndSelectorsContext.Provider value={data}>
      <DataViewerAndSelectorsDispatchContext.Provider value={dispatch}>
        {children}
      </DataViewerAndSelectorsDispatchContext.Provider>
    </DataViewerAndSelectorsContext.Provider>
  );
};

export function usedataViewerAndSelectors() {
  return useContext(DataViewerAndSelectorsContext);
}

export function useConfigDispatch() {
  return useContext(DataViewerAndSelectorsDispatchContext);
}
