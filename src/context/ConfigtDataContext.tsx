import { createContext, useContext, useReducer, Dispatch } from 'react';
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from '../types/ConfigDataContextType';

const initData = {
  decimal: 0,
  height: 0,
  width: 0,
  characterFontWidth: 0,
};
const ConfigDataContext = createContext<ConfigDataContextType>(initData);
const ConfigDispatchContext = createContext<Dispatch<ConfigDataActionType>>(
  () => {}
);

function dataReducer(
  state: ConfigDataContextType,
  action: ConfigDataActionType
) {
  if (action.type === 'changeContainerDimension') {
    let newState = state;
    state.width = action.containerWidth;
    state.height = action.containerHeight;
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
