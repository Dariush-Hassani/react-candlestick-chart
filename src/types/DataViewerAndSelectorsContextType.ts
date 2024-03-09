export type DataViewerAndSelectorsContextType = {
  cursorLocation: {
    x: number;
    y: number;
  };
  lockOnCandle: boolean;
};
export type DataViewerAndSelectorsActionType =
  | {
      type: "changeLocation";
      x: number;
      y: number;
    }
  | {
      type: "changeLockOnCandle";
      lockOnCandle: boolean;
    };
