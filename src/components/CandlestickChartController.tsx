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
import { ColorsActionType, ColorsType } from "../types/ColorsType";
import { useColorsDispatch } from "../context/ColorsContext";

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
  ColorPalette: ColorsType;
  rangeSelector: {
    enable: boolean;
    height: number;
    initialRange: {
      type: "month" | "day" | "hour" | "percent" | "milliseconds";
      value: number;
    };
  };
  responsiveBreakPoint: number;
  enableResetButton: boolean;
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
  enableResetButton,
  ColorPalette,
}) => {
  const dispatchData: Dispatch<DataActionType> = useDataDispatch();
  const dispatchConfig: Dispatch<ConfigDataActionType> = useConfigDispatch();
  const data: DataContextType = useData();
  const config: ConfigDataContextType = useConfigData();
  const candlesCanvasId = `${id}-candles-canvas`;

  const dispatchColors: Dispatch<ColorsActionType> = useColorsDispatch();

  const [yScaleFunction, setYScaleFunction] = useState<any>(null);
  const [xScaleFunction, setXScaleFunction] = useState<any>(null);

  const [RSYScaleFunction, setRSYScaleFunction] = useState<any>(null);
  const [RSXScaleFunction, setRSXScaleFunction] = useState<any>(null);

  useEffect(() => {
    dispatchColors({ type: "changeColors", colorPalette: ColorPalette });
  }, [ColorPalette]);

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
      enableResetButton={enableResetButton}
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
