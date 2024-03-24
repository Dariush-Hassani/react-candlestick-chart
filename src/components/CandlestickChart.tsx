import React from "react";
import CandlestickChartController from "./CandlestickChartController";
import { ConfigDataProvider } from "../context/ConfigtDataContext";
import { DataProvider } from "../context/DataContext";
import { DataViewerAndSelectorsProvider } from "../context/DataViewerAndSelectorsContext";
import { DataViewerTextsType } from "../types/DataViewerTextsType";
import { DataViewerColorsType } from "../types/DataViewerColorsType";

const CandlestickChart: React.FC<{
  data: any;
  id: string;
  width: number;
  height: number;
  decimal?: number;
  dataViewerTexts?: DataViewerTextsType;
  dataViewerColors?: DataViewerColorsType;
}> = ({
  data,
  id,
  width,
  height,
  decimal,
  dataViewerTexts,
  dataViewerColors,
}) => {
  return (
    <DataProvider>
      <ConfigDataProvider>
        <DataViewerAndSelectorsProvider>
          <CandlestickChartController
            chartData={data}
            id={id}
            width={width}
            height={height}
            decimal={decimal ?? 0}
            dataViewerTexts={{
              shortPosition: dataViewerTexts?.shortPosition ?? "Short",
              longPosition: dataViewerTexts?.longPosition ?? "Long",
              StopLoss: dataViewerTexts?.StopLoss ?? "sl",
              takeProfit: dataViewerTexts?.takeProfit ?? "tp",
              open: dataViewerTexts?.open ?? "O",
              high: dataViewerTexts?.high ?? "H",
              low: dataViewerTexts?.low ?? "L",
              close: dataViewerTexts?.close ?? "C",
            }}
            dataViewerColors={{
              shortPositionLabel:
                dataViewerColors?.shortPositionLabel ?? "#b2b5be",
              shortPositionData: dataViewerColors?.shortPositionData ?? "#fff",
              longPositionLabel:
                dataViewerColors?.longPositionLabel ?? "#b2b5be",
              longPositionData: dataViewerColors?.longPositionData ?? "#fff",
              StopLossLabel: dataViewerColors?.StopLossLabel ?? "#b2b5be",
              StopLossData: dataViewerColors?.StopLossData ?? "#F9DB04",
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
        </DataViewerAndSelectorsProvider>
      </ConfigDataProvider>
    </DataProvider>
  );
};

export default CandlestickChart;
