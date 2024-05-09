export type ColorsPropType = {
  background?: string;
  grid?: string;
  tick?: string;
  selectorLine?: string;
  selectorLabelBackground?: string;
  selectorLabelText?: string;
  greenCandle?: string;
  redCandle?: string;
  longPosition?: string;
  shortPosition?: string;
  sl?: string;
  tp?: string;
  RSChartStroke?: string;
  RSChartOverlay?: string;
  RSChartOverlayResize?: string;
  resetButtonColor?: string;
};
export type ColorsType = {
  background: string;
  grid: string;
  tick: string;
  selectorLine: string;
  selectorLabelBackground: string;
  selectorLabelText: string;
  greenCandle: string;
  redCandle: string;
  longPosition: string;
  shortPosition: string;
  sl: string;
  tp: string;
  RSChartStroke: string;
  RSChartOverlay: string;
  RSChartOverlayResize: string;
  resetButtonColor: string;
};

export type ColorsActionType = {
  type: "changeColors";
  colorPalette: ColorsType;
};
