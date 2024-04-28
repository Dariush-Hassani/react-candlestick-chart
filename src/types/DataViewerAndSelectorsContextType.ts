export type DataViewerAndSelectorsContextType = {
  candleIndex: number;
  showLines: boolean;
};
export type DataViewerAndSelectorsActionType =
  | {
      type: "changeCandleIndex";
      candleIndex: number;
    }
  | {
      type: "changeShowLines";
      showLines: boolean;
    };
