export type ConfigDataContextType = {
  canvasWidth?: number;
  canvasHeight?: number;
  chartHeight?: number;
  rangeSelectorRealHeight: number;
  decimal: number;
  characterFontWidth: number;
  emptySpaceFromTopPercent: number;
  emptySpaceFromBottomPercent: number;
  emptySpaceFromTopPercentRS: number;
  emptySpaceFromBottomPercentRS: number;
};

export type ConfigDataActionType =
  | {
      type: "changeDiagramDimension";
      canvasWidth: number;
      canvasHeight: number;
      chartHeight: number;
      rangeSelectorRealHeight: number;
    }
  | {
      type: "changeDecimal";
      decimal: number;
    };
