import { useData, useDataDispatch } from "../context/DataContext";
import Layout from "./Layout";
import React, { Dispatch, useEffect, useState } from "react";
import {
  useConfigData,
  useConfigDispatch,
} from "../context/ConfigtDataContext";
import * as d3 from "d3";
import dataType from "../types/DataType";
import { dataNormalizer } from "../utils/helperFunctions";
import CandlesCanvas from "./CandlesCanvas";
import CandlesSelectorLinesAndLabels from "./CandlesSelectorLinesAndLabels";
import { DataActionType, DataContextType } from "../types/DataContextType";
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from "../types/ConfigDataContextType";
import { DataViewerColorsType } from "../types/DataViewerColorsType";
import { DataViewerTextsType } from "../types/DataViewerTextsType";

const CandlestickChartController: React.FC<{
  chartData: any;
  id: string;
  width: number;
  height: number;
  decimal: number;
  dataViewerTexts: DataViewerTextsType;
  dataViewerColors: DataViewerColorsType;
  scrollZoom: {
    enable: boolean;
    max: number;
  };
  rangeSelector: {
    enable: boolean;
    height: number;
    initialRange: {
      type: "month" | "day" | "hour" | "percent" | "milliseconds";
      value: number;
    };
  };
  responsiveBreakPoint: number;
}> = ({
  chartData,
  id,
  width,
  height,
  decimal,
  dataViewerTexts,
  dataViewerColors,
  scrollZoom,
  rangeSelector,
  responsiveBreakPoint,
}) => {
  const dispatchData: Dispatch<DataActionType> = useDataDispatch();
  const dispatchConfig: Dispatch<ConfigDataActionType> = useConfigDispatch();
  const data: DataContextType = useData();
  const config: ConfigDataContextType = useConfigData();
  const candlesCanvasId = `${id}-candles-canvas`;

  const [yScaleFunction, setYScaleFunction] = useState<any>(null);
  const [xScaleFunction, setXScaleFunction] = useState<any>(null);

  const [RSYScaleFunction, setRSYScaleFunction] = useState<any>(null);
  const [RSXScaleFunction, setRSXScaleFunction] = useState<any>(null);

  const initialRangeCalculator = (
    initialRange: {
      type: "month" | "day" | "hour" | "percent" | "milliseconds";
      value: number;
    },
    initData: dataType[],
    candleWidthDate: number,
  ) => {
    if (initData.length < 2 || !initialRange || !candleWidthDate) return;

    if (initialRange.type === "percent") {
      let val;
      if (initialRange.value > 100) val = 100;
      else if (initialRange.value <= 0.1) val = 0.1;
      else val = initialRange.value;

      let lastDate = initData[initData.length - 1].date;
      let firstDate = initData[0].date;
      let range = lastDate - firstDate;
      range *= val / 100;
      let newStartRange = lastDate - range;
      dispatchData({
        type: "changeShownRange",
        shownRange: {
          start: newStartRange + candleWidthDate / 2,
          end: lastDate + candleWidthDate / 2,
        },
      });
    } else {
      let rangeInMilliSeconds = 0;
      let val = initialRange.value <= 0 ? 0 : initialRange.value;
      let coeff = 3.6 * Math.pow(10, 6);
      if (initialRange.type === "milliseconds") rangeInMilliSeconds = val;
      else if (initialRange.type === "hour") rangeInMilliSeconds = val * coeff;
      else if (initialRange.type === "day")
        rangeInMilliSeconds = val * coeff * 24;
      else if (initialRange.type === "month")
        rangeInMilliSeconds = val * coeff * 24 * 30;

      let lastDate = initData[initData.length - 1].date;
      let firstDate = initData[0].date;

      let startRange = lastDate - rangeInMilliSeconds;
      let endRange = lastDate;

      if (startRange < firstDate) startRange = firstDate;

      dispatchData({
        type: "changeShownRange",
        shownRange: {
          start: startRange + candleWidthDate / 2,
          end: endRange + candleWidthDate / 2,
        },
      });
    }
  };

  useEffect(() => {
    dispatchData({
      type: "changeInitData",
      initData: dataNormalizer(chartData) as dataType[],
    });
  }, [chartData]);
  useEffect(() => {
    dispatchConfig({
      type: "changeDecimal",
      decimal: decimal,
    });
  }, [decimal]);

  useEffect(() => {
    let newYScaleFunction = d3
      .scaleLinear()
      .domain([
        data.minMaxShownPrice.max +
          config.emptySpaceFromTopPercent * data.minMaxShownPrice.max,
        data.minMaxShownPrice.min -
          config.emptySpaceFromBottomPercent * data.minMaxShownPrice.min,
      ])
      .range([0, config.canvasHeight ?? 0]);
    setYScaleFunction(() => newYScaleFunction);
  }, [data.minMaxShownPrice, config.canvasHeight]);

  useEffect(() => {
    initialRangeCalculator(
      rangeSelector.initialRange,
      data.initData,
      data.candleWidthDate,
    );
  }, [rangeSelector.initialRange, data.initData, data.candleWidthDate]);

  useEffect(() => {
    let newXScaleFunction = d3
      .scaleTime()
      .domain([data.shownRange.start, data.shownRange.end])
      .range([0, config.canvasWidth ?? 0]);
    setXScaleFunction(() => newXScaleFunction);
  }, [data.shownRange, config.canvasWidth]);

  useEffect(() => {
    let newRSYScaleFunction = d3
      .scaleLinear()
      .domain([
        data.minMaxInitPrice.max +
          config.emptySpaceFromTopPercentRS * data.minMaxInitPrice.max,
        data.minMaxInitPrice.min -
          config.emptySpaceFromBottomPercentRS * data.minMaxInitPrice.min,
      ])
      .range([0, config.rangeSelectorRealHeight ?? 0]);
    setRSYScaleFunction(() => newRSYScaleFunction);
  }, [
    data.minMaxInitPrice,
    rangeSelector.height,
    config.rangeSelectorRealHeight,
  ]);

  useEffect(() => {
    let newRSXScaleFunction = d3
      .scaleTime()
      .domain([data.minMaxInitDate.min, data.minMaxInitDate.max])
      .range([0, config.canvasWidth ?? 0]);
    setRSXScaleFunction(() => newRSXScaleFunction);
  }, [data.minMaxInitDate, config.canvasWidth]);

  return (
    <Layout
      xScaleFunction={xScaleFunction}
      yScaleFunction={yScaleFunction}
      id={id}
      width={width}
      height={height}
      dataViewerColors={dataViewerColors}
      dataViewerTexts={dataViewerTexts}
      decimal={decimal}
      rangeSelector={rangeSelector}
      RSYScaleFunction={RSYScaleFunction}
      RSXScaleFunction={RSXScaleFunction}
      candlesCanvasId={candlesCanvasId}
      responsiveBreakPoint={responsiveBreakPoint}
      chartElement={
        <foreignObject width={config.canvasWidth} height={config.canvasHeight}>
          <CandlesCanvas
            id={candlesCanvasId}
            xScaleFunction={xScaleFunction}
            yScaleFunction={yScaleFunction}
          />
        </foreignObject>
      }
    >
      <CandlesSelectorLinesAndLabels
        xScaleFunction={xScaleFunction}
        yScaleFunction={yScaleFunction}
        chartId={id}
        candlesCanvasId={candlesCanvasId}
        scrollZoom={scrollZoom}
      />
    </Layout>
  );
};
export default CandlestickChartController;
