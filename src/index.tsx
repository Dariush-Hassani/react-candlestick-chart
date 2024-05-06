import React from "react";
import { DataViewerTextsType } from "./types/DataViewerTextsType";
import { DataViewerColorsType } from "./types/DataViewerColorsType";
import { ColorsPropType } from "./types/ColorsType";
import { DataProvider } from "./context/DataContext";
import { ConfigDataProvider } from "./context/ConfigtDataContext";
import { DataViewerAndSelectorsProvider } from "./context/DataViewerAndSelectorsContext";
import { ColorsProvider } from "./context/ColorsContext";
import CandlestickChartController from "./components/CandlestickChartController";

const CandlestickChart: React.FC<{
  data: any;
  id: string;
  width: number;
  height: number;
  decimal?: number;
  dataViewerTexts?: DataViewerTextsType;
  dataViewerColors?: DataViewerColorsType;
  scrollZoom?: {
    enable: boolean;
    max: number;
  };
  rangeSelector?: {
    enable: boolean;
    height: number;
    initialRange?: {
      type: "month" | "day" | "hour" | "percent" | "milliseconds";
      value: number;
    };
  };
  enableResetButton?: boolean;
  responsiveBreakPoint?: number;
  ColorPalette?: ColorsPropType;
}> = ({
  data,
  id,
  width,
  height,
  decimal,
  dataViewerTexts,
  dataViewerColors,
  scrollZoom,
  rangeSelector,
  responsiveBreakPoint,
  enableResetButton = true,
  ColorPalette,
}) => {
  return (
    <DataProvider>
      <ConfigDataProvider>
        <DataViewerAndSelectorsProvider>
          <ColorsProvider>
            <CandlestickChartController
              chartData={data}
              id={id}
              width={width}
              height={height}
              decimal={decimal ?? 0}
              responsiveBreakPoint={responsiveBreakPoint ?? 400}
              scrollZoom={{
                enable: scrollZoom ? scrollZoom.enable : false,
                max: scrollZoom ? scrollZoom.max : 1,
              }}
              rangeSelector={{
                enable: rangeSelector ? rangeSelector.enable : false,
                height: rangeSelector ? rangeSelector.height : 0,
                initialRange:
                  rangeSelector && rangeSelector.initialRange
                    ? rangeSelector.initialRange
                    : { type: "percent", value: 100 },
              }}
              ColorPalette={{
                background:
                  ColorPalette && ColorPalette.background
                    ? ColorPalette.background
                    : "#161b26",
                grid:
                  ColorPalette && ColorPalette.grid
                    ? ColorPalette.grid
                    : "#222631",
                tick:
                  ColorPalette && ColorPalette.tick
                    ? ColorPalette.tick
                    : "#b2b5be",
                selectorLine:
                  ColorPalette && ColorPalette.selectorLine
                    ? ColorPalette.selectorLine
                    : "rgba(178,181,190,0.5)",
                selectorLabelBackground:
                  ColorPalette && ColorPalette.selectorLabelBackground
                    ? ColorPalette.selectorLabelBackground
                    : "#2a2e39",
                selectorLabelText:
                  ColorPalette && ColorPalette.selectorLabelText
                    ? ColorPalette.selectorLabelText
                    : "#b2b5be",
                greenCandle:
                  ColorPalette && ColorPalette.greenCandle
                    ? ColorPalette.greenCandle
                    : "#089981",
                redCandle:
                  ColorPalette && ColorPalette.redCandle
                    ? ColorPalette.redCandle
                    : "#e13443",
                longPosition:
                  ColorPalette && ColorPalette.longPosition
                    ? ColorPalette.longPosition
                    : "#fff",
                shortPosition:
                  ColorPalette && ColorPalette.shortPosition
                    ? ColorPalette.shortPosition
                    : "#fff",
                sl:
                  ColorPalette && ColorPalette.sl ? ColorPalette.sl : "#F9DB04",
                tp:
                  ColorPalette && ColorPalette.tp ? ColorPalette.tp : "#04F5F9",
                RSChartStroke:
                  ColorPalette && ColorPalette.RSChartStroke
                    ? ColorPalette.RSChartStroke
                    : "#04F5F9",
                RSChartOverlay:
                  ColorPalette && ColorPalette.RSChartOverlay
                    ? ColorPalette.RSChartOverlay
                    : "#000",
                RSChartOverlayResize:
                  ColorPalette && ColorPalette.RSChartOverlayResize
                    ? ColorPalette.RSChartOverlayResize
                    : "#e13443",
                resetButtonColor:
                  ColorPalette && ColorPalette.resetButtonColor
                    ? ColorPalette.resetButtonColor
                    : "#04F5F9",
              }}
              enableResetButton={enableResetButton}
              dataViewerTexts={{
                shortPosition: dataViewerTexts?.shortPosition ?? "Short",
                longPosition: dataViewerTexts?.longPosition ?? "Long",
                stopLoss: dataViewerTexts?.stopLoss ?? "sl",
                takeProfit: dataViewerTexts?.takeProfit ?? "tp",
                open: dataViewerTexts?.open ?? "O",
                high: dataViewerTexts?.high ?? "H",
                low: dataViewerTexts?.low ?? "L",
                close: dataViewerTexts?.close ?? "C",
              }}
              dataViewerColors={{
                shortPositionLabel:
                  dataViewerColors?.shortPositionLabel ?? "#b2b5be",
                shortPositionData:
                  dataViewerColors?.shortPositionData ?? "#fff",
                longPositionLabel:
                  dataViewerColors?.longPositionLabel ?? "#b2b5be",
                longPositionData: dataViewerColors?.longPositionData ?? "#fff",
                stopLossLabel: dataViewerColors?.stopLossLabel ?? "#b2b5be",
                stopLossData: dataViewerColors?.stopLossData ?? "#F9DB04",
                takeProfitLabel: dataViewerColors?.takeProfitLabel ?? "#b2b5be",
                takeProfitData: dataViewerColors?.takeProfitData ?? "#04F5F9",
                openLabel: dataViewerColors?.openLabel ?? "#b2b5be",
                openDataUp: dataViewerColors?.openDataUp ?? "#089981",
                openDataDown: dataViewerColors?.openDataDown ?? "#e13443",
                highLabel: dataViewerColors?.highLabel ?? "#b2b5be",
                highDataUp: dataViewerColors?.highDataUp ?? "#089981",
                highDataDown: dataViewerColors?.highDataDown ?? "#e13443",
                lowLabel: dataViewerColors?.lowLabel ?? "#b2b5be",
                lowDataUp: dataViewerColors?.lowDataUp ?? "#089981",
                lowDataDown: dataViewerColors?.lowDataDown ?? "#e13443",
                closeLabel: dataViewerColors?.closeLabel ?? "#b2b5be",
                closeDataUp: dataViewerColors?.closeDataUp ?? "#089981",
                closeDataDown: dataViewerColors?.closeDataDown ?? "#e13443",
              }}
            />
          </ColorsProvider>
        </DataViewerAndSelectorsProvider>
      </ConfigDataProvider>
    </DataProvider>
  );
};

export default CandlestickChart;
