export type ConfigDataContextType = {
  canvasWidth?: number;
  canvasHeight?: number;
  decimal: number;
  characterFontWidth: number;
};

export type ConfigDataActionType =
  | {
      type: "changeDiagramDimension";
      canvasWidth: number;
      canvasHeight: number;
    }
  | {
      type: "changeDecimal";
      decimal: number;
    };
