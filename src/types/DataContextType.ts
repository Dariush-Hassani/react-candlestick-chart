import DataType from "./DataType";

export type DataContextType = {
  initData: DataType[];
  shownData: DataType[];
  shownRange: {
    start: number;
    end: number;
  };
  minMaxInitDate: {
    min: number;
    max: number;
  };
  minMaxInitPrice: {
    min: number;
    max: number;
  };
  minMaxShownDate: {
    min: number;
    max: number;
  };
  minMaxShownPrice: {
    min: number;
    max: number;
  };
  zoomFactor: number;
  incrementZoomFactor: number;
  decrementZoomFactor: number;
  candleWidthDate: number;
  candleLockerWidthDate: number;
};

export type DataActionType =
  | { type: "changeInitData"; initData: DataType[] }
  | { type: "changeShownRange"; shownRange: { start: number; end: number } };
