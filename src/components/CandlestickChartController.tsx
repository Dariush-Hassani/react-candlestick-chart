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
import CandlesSelectorLines from "./CandlesSelectorLines";
import SelectedCandleDataViewer from "./SelectedCandleDataViewer";
import { DataActionType, DataContextType } from "../types/DataContextType";
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from "../types/ConfigDataContextType";

const CandlestickChartController: React.FC<{
  chartData: any;
  id: string;
  width: number;
  height: number;
  decimal?: number;
}> = ({ chartData, id, width, height, decimal }) => {
  const dispatchData: Dispatch<DataActionType> = useDataDispatch();
  const dispatchConfig: Dispatch<ConfigDataActionType> = useConfigDispatch();
  const data: DataContextType = useData();
  const config: ConfigDataContextType = useConfigData();
  const candlesCanvasId = `${id}-candles-canvas`;

  const [yScaleFunction, setYScaleFunction] = useState<any>(null);
  const [xScaleFunction, setXScaleFunction] = useState<any>(null);

  useEffect(() => {
    dispatchData({
      type: "changeInitData",
      initData: dataNormalizer(chartData) as dataType[],
    });
  }, [chartData]);
  useEffect(() => {
    dispatchConfig({
      type: "changeDecimal",
      decimal: decimal ?? 0,
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

  return (
    <Layout
      xScaleFunction={xScaleFunction}
      yScaleFunction={yScaleFunction}
      id={id}
      width={width}
      height={height}
    >
      <SelectedCandleDataViewer />
      <foreignObject width={config.canvasWidth} height={config.canvasHeight}>
        <CandlesCanvas id={candlesCanvasId} />
      </foreignObject>
      <CandlesSelectorLines
        xScaleFunction={xScaleFunction}
        yScaleFunction={yScaleFunction}
        chartId={id}
        candlesCanvasId={candlesCanvasId}
      />
    </Layout>
  );
};
export default CandlestickChartController;
