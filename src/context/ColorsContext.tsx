import React, { createContext, Dispatch, useContext, useReducer } from "react";
import { ColorsActionType, ColorsType } from "../types/ColorsType";

const initData: ColorsType = {
  background: "#161b26",
  grid: "#222631",
  tick: "#b2b5be",
  selectorLine: "rgba(178,181,190,0.5)",
  selectorLabelBackground: "#2a2e39",
  selectorLabelText: "#b2b5be",
  greenCandle: "#089981",
  redCandle: "#e13443",
  longPosition: "#fff",
  shortPosition: "#fff",
  sl: "#F9DB04",
  tp: "#04F5F9",
  RSChartStroke: "#04F5F9",
  RSChartOverlay: "#000",
  RSChartOverlayResize: "#e13443",
  resetButtonColor: "#04F5F9",
};

const ColorsContext = createContext<ColorsType>(initData);
const ColorsDispatchContext = createContext<Dispatch<ColorsActionType>>(
  () => {},
);

function colorsReducer(state: ColorsType, action: ColorsActionType) {
  if (action.type === "changeColors") {
    let newState = { ...state };
    newState.background = action.colorPalette.background
      ? action.colorPalette.background
      : state.background;
    newState.grid = action.colorPalette.grid
      ? action.colorPalette.grid
      : state.grid;
    newState.tick = action.colorPalette.tick
      ? action.colorPalette.tick
      : state.tick;
    newState.selectorLine = action.colorPalette.selectorLine
      ? action.colorPalette.selectorLine
      : state.selectorLine;
    newState.selectorLabelBackground = action.colorPalette
      .selectorLabelBackground
      ? action.colorPalette.selectorLabelBackground
      : state.selectorLabelBackground;
    newState.selectorLabelText = action.colorPalette.selectorLabelText
      ? action.colorPalette.selectorLabelText
      : state.selectorLabelText;
    newState.greenCandle = action.colorPalette.greenCandle
      ? action.colorPalette.greenCandle
      : state.greenCandle;
    newState.redCandle = action.colorPalette.redCandle
      ? action.colorPalette.redCandle
      : state.redCandle;
    newState.longPosition = action.colorPalette.longPosition
      ? action.colorPalette.longPosition
      : state.longPosition;
    newState.shortPosition = action.colorPalette.shortPosition
      ? action.colorPalette.shortPosition
      : state.shortPosition;
    newState.sl = action.colorPalette.sl ? action.colorPalette.sl : state.sl;
    newState.tp = action.colorPalette.tp ? action.colorPalette.tp : state.tp;
    newState.RSChartStroke = action.colorPalette.RSChartStroke
      ? action.colorPalette.RSChartStroke
      : state.RSChartStroke;
    newState.RSChartOverlay = action.colorPalette.RSChartOverlay
      ? action.colorPalette.RSChartOverlay
      : state.RSChartOverlay;
    newState.RSChartOverlayResize = action.colorPalette.RSChartOverlayResize
      ? action.colorPalette.RSChartOverlayResize
      : state.RSChartOverlayResize;
    newState.resetButtonColor = action.colorPalette.resetButtonColor
      ? action.colorPalette.resetButtonColor
      : state.resetButtonColor;
    return newState;
  } else {
    return state;
  }
}

export const ColorsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, dispatch] = useReducer(colorsReducer, initData);

  return (
    <ColorsContext.Provider value={data}>
      <ColorsDispatchContext.Provider value={dispatch}>
        {children}
      </ColorsDispatchContext.Provider>
    </ColorsContext.Provider>
  );
};

export function useColors() {
  return useContext(ColorsContext);
}

export function useColorsDispatch() {
  return useContext(ColorsDispatchContext);
}
