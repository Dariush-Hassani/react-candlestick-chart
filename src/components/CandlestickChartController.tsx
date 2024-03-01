import { useData, useDataDispatch } from "../context/DataContext";
import Layout from "./Layout";
import React, { useEffect, useState } from "react";
import {
  useConfigData,
  useConfigDispatch,
} from "../context/ConfigtDataContext";
import * as d3 from "d3";

const CandlestickChartController: React.FC<{
  chartData: any;
  id: string;
  width: number;
  height: number;
  decimal?: number;
}> = ({ chartData, id, width, height, decimal }) => {
  const dispatchData = useDataDispatch();
  const dispatchConfig = useConfigDispatch();
  const data = useData();
  const config = useConfigData();
  const [yScaleFunction, setYScaleFunction] = useState<any>(null);
  const [xScaleFunction, setXScaleFunction] = useState<any>(null);

  useEffect(() => {
    dispatchData({
      type: "changeInitData",
      initData: chartData,
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
      <div></div>
    </Layout>
  );
};
export default CandlestickChartController;
