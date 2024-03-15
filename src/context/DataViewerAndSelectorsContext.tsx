import {
  DataViewerAndSelectorsActionType,
  DataViewerAndSelectorsContextType,
} from "../types/DataViewerAndSelectorsContextType";
import React, { createContext, Dispatch, useContext, useReducer } from "react";

const initData: DataViewerAndSelectorsContextType = {
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
  if (action.type === "changeLockOnCandle") {
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

export function useDataViewerAndSelectors() {
  return useContext(DataViewerAndSelectorsContext);
}

export function useDataViewerAndSelectorsDispatch() {
  return useContext(DataViewerAndSelectorsDispatchContext);
}
