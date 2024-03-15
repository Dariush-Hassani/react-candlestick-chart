import React, { Dispatch, useEffect, useMemo } from "react";
import { useData } from "../context/DataContext";
import {
  useConfigData,
  useConfigDispatch,
} from "../context/ConfigtDataContext";
import * as d3 from "d3";
import { colors } from "../utils/Colors";
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from "../types/ConfigDataContextType";
import { DataContextType } from "../types/DataContextType";

const Layout: React.FC<{
  id: string;
  width: number;
  height: number;
  children: React.ReactNode;
  xScaleFunction: any;
  yScaleFunction: any;
}> = ({ id, width, height, yScaleFunction, xScaleFunction, children }) => {
  const yAxisId = `${id}-yAxis`;
  const xAxisId = `${id}-xAxis`;

  const dispatchConfig: Dispatch<ConfigDataActionType> = useConfigDispatch();
  const data: DataContextType = useData();
  const config: ConfigDataContextType = useConfigData();

  const paddingLeft = 25;
  const paddingTop = 10;
  const paddingBottom = 30;
  const paddingRight = useMemo(
    () =>
      2.5 +
      data.minMaxInitPrice.max.toFixed(config.decimal).toString().length *
        config.characterFontWidth,
    [data.minMaxInitPrice.max, config.decimal],
  );

  useEffect(() => {
    if (width !== 0 && height !== 0) {
      dispatchConfig({
        type: "changeDiagramDimension",
        canvasHeight: height - (paddingBottom + paddingTop + 6),
        canvasWidth: width - (paddingLeft + paddingRight) - 2,
      });
    }
  }, [width, height, config.decimal]);

  useEffect(() => {
    if (yScaleFunction) {
      d3.select(`#${yAxisId}`).html("");
      let yAxis = d3
        .axisRight(yScaleFunction)
        .tickSize(config.canvasWidth ?? 0);
      d3.select(`#${yAxisId}`).append("g").call(yAxis);
      d3.select(`#${yAxisId} .domain`).remove();
      d3.selectAll(`#${yAxisId} g text`).attr("transform", "translate(5,0)");
      d3.selectAll(`#${yAxisId} .tick line`).style("stroke", colors.grid);
      d3.selectAll(`#${yAxisId} .tick text`).style("fill", colors.tick);
    }
  }, [yScaleFunction]);

  useEffect(() => {
    if (xScaleFunction) {
      d3.select(`#${xAxisId}`).html("");
      let xAxis = d3
        .axisBottom(xScaleFunction)
        .ticks((config.canvasWidth ?? 0) / 100)
        .tickSize(config.canvasHeight ?? 0);
      d3.select(`#${xAxisId}`).append("g").call(xAxis);
      d3.select(`#${xAxisId} .domain`).remove();
      d3.selectAll(`#${xAxisId} g text`).attr("transform", "translate(0,10)");
      d3.selectAll(`#${xAxisId} .tick line`).style("stroke", colors.grid);
      d3.selectAll(`#${xAxisId} .tick text`).style("fill", colors.tick);
    }
  }, [xScaleFunction]);

  return (
    <div
      id={id}
      style={{
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        display: "inline-block",
      }}
    >
      <svg
        width={config.canvasWidth}
        height={config.canvasHeight}
        style={{ overflow: "inherit", cursor: "crosshair" }}
      >
        <g id={`${yAxisId}`}></g>
        <g id={`${xAxisId}`}></g>
        {children}
      </svg>
    </div>
  );
};

export default Layout;
