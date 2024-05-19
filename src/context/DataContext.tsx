import React, { createContext, useReducer, Dispatch, useContext } from "react";
import { DataActionType, DataContextType } from "../types/DataContextType";
import {
  calculateCandleWidthDate,
  dateArrayNormalizer,
} from "../utils/helperFunctions";
import * as d3 from "d3";

const initData: DataContextType = {
  initData: [],
  shownData: [],
  shownRange: {
    start: 0,
    end: 0,
  },
  minMaxInitDate: {
    min: 0,
    max: 0,
  },
  minMaxInitPrice: {
    min: 0,
    max: 0,
  },
  minMaxShownDate: {
    min: 0,
    max: 0,
  },
  minMaxShownPrice: {
    min: 0,
    max: 0,
  },
  zoomFactor: 1,
  incrementZoomFactor: 1.05,
  decrementZoomFactor: 0.9,
  candleWidthDate: 0,
  candleLockerWidthDate: 0,
};

const DataContext = createContext<DataContextType>(initData);
const DataDispatchContext = createContext<Dispatch<DataActionType>>(() => {});

function dataReducer(state: DataContextType, action: DataActionType) {
  switch (action.type) {
    case "changeInitData": {
      if (action.initData.length === 0) return state;

      let newInitData = action.initData;

      let initDates = newInitData.map((x) => x.date);
      let normalizeInitDates = (
        dateArrayNormalizer(initDates) as number[]
      ).sort((a, b) => a - b);
      newInitData.forEach((x, i) => (x.date = normalizeInitDates[i]));

      let slPrices: number[] = newInitData
        .filter((x) => x.position && typeof x.position?.sl !== undefined)
        .map((x) => x.position?.sl as number);

      let tpPrices: number[] = newInitData
        .filter((x) => x.position && typeof x.position?.tp !== undefined)
        .map((x) => x.position?.tp as number);

      let highPrices: number[] = newInitData.map((x) => x.high as number);
      let lowPrices: number[] = newInitData.map((x) => x.low as number);

      let newMinMaxInitPrice = d3.extent([
        ...highPrices,
        ...lowPrices,
        ...slPrices,
        ...tpPrices,
      ]);

      let lastIndex = normalizeInitDates.length - 1;

      let [candleWidth, candleLockerWidth] =
        calculateCandleWidthDate(normalizeInitDates);

      let newState: DataContextType = {
        initData: newInitData,
        shownData: newInitData,
        minMaxInitDate: {
          min: (normalizeInitDates[0] - candleWidth / 2) as number,
          max: (normalizeInitDates[lastIndex] + candleWidth / 2) as number,
        },
        minMaxShownDate: {
          min: (normalizeInitDates[0] - candleWidth / 2) as number,
          max: (normalizeInitDates[lastIndex] + candleWidth / 2) as number,
        },
        shownRange: {
          start: (normalizeInitDates[0] - candleWidth / 2) as number,
          end: (normalizeInitDates[lastIndex] + candleWidth / 2) as number,
        },
        minMaxInitPrice: {
          min: newMinMaxInitPrice[0] as number,
          max: newMinMaxInitPrice[1] as number,
        },
        minMaxShownPrice: {
          min: newMinMaxInitPrice[0] as number,
          max: newMinMaxInitPrice[1] as number,
        },
        zoomFactor: state.zoomFactor,
        incrementZoomFactor: state.incrementZoomFactor,
        decrementZoomFactor: state.decrementZoomFactor,
        candleWidthDate: candleWidth,
        candleLockerWidthDate: candleLockerWidth,
      };
      return newState;
    }
    case "changeShownRange": {
      let newShownRange = action.shownRange;
      newShownRange.start =
        newShownRange.start < state.minMaxInitDate.min
          ? state.minMaxInitDate.min
          : newShownRange.start;

      newShownRange.end =
        newShownRange.end > state.minMaxInitDate.max
          ? state.minMaxInitDate.max
          : newShownRange.end;

      let newZoomFactor: number =
        (state.minMaxInitDate.max - state.minMaxInitDate.min) /
        (newShownRange.end - newShownRange.start);

      let newShownData = state.initData.filter(
        (x) =>
          x.date < newShownRange.end + state.candleWidthDate / 2 &&
          x.date > newShownRange.start - state.candleWidthDate / 2,
      );

      let slPrices: number[] = newShownData
        .filter((x) => x.position && typeof x.position?.sl !== undefined)
        .map((x) => x.position?.sl as number);

      let tpPrices: number[] = newShownData
        .filter((x) => x.position && typeof x.position?.tp !== undefined)
        .map((x) => x.position?.tp as number);

      let highPrices: number[] = newShownData.map((x) => x.high as number);
      let lowPrices: number[] = newShownData.map((x) => x.low as number);

      let allPrices: number[] = [
        ...highPrices,
        ...lowPrices,
        ...slPrices,
        ...tpPrices,
      ];
      let newMinMaxShownPrice = d3.extent(allPrices);

      newMinMaxShownPrice[0] = newMinMaxShownPrice[0]
        ? newMinMaxShownPrice[0]
        : 0;
      newMinMaxShownPrice[1] = newMinMaxShownPrice[0]
        ? newMinMaxShownPrice[1]
        : 0;

      let newState = { ...state };

      newState.shownData = newShownData;
      newState.minMaxShownDate = {
        min: newShownRange.start,
        max: newShownRange.end,
      };
      newState.minMaxShownPrice = {
        min: newMinMaxShownPrice[0] as number,
        max: newMinMaxShownPrice[1] as number,
      };
      newState.shownRange = newShownRange;
      newState.zoomFactor = newZoomFactor;

      return newState;
    }
    default: {
      return state;
    }
  }
}

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, dispatch] = useReducer(dataReducer, initData);
  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
};

export function useData() {
  return useContext(DataContext);
}

export function useDataDispatch() {
  return useContext(DataDispatchContext);
}
