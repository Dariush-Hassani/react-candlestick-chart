import React, { Dispatch, SVGProps, useEffect, useMemo } from "react";
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
import SelectedCandleDataViewer from "./SelectedCandleDataViewer";
import { DataViewerTextsType } from "../types/DataViewerTextsType";
import { DataViewerColorsType } from "../types/DataViewerColorsType";
import RSChart from "./RSChart";

const Layout: React.FC<{
  id: string;
  width: number;
  height: number;
  children: React.ReactNode;
  xScaleFunction: any;
  yScaleFunction: any;
  RSXScaleFunction: any;
  RSYScaleFunction: any;
  dataViewerTexts: DataViewerTextsType;
  dataViewerColors: DataViewerColorsType;
  decimal: number;
  rangeSelector: {
    enable: boolean;
    height: number;
  };
  chartElement: SVGProps<SVGForeignObjectElement>;
}> = ({
  id,
  width,
  height,
  yScaleFunction,
  xScaleFunction,
  children,
  dataViewerTexts,
  dataViewerColors,
  decimal,
  rangeSelector,
  chartElement,
  RSYScaleFunction,
  RSXScaleFunction,
}) => {
  const yAxisId = `${id}-yAxis`;
  const xAxisId = `${id}-xAxis`;
  const yAxisIdRS = `${yAxisId}-RS`;
  const xAxisIdRS = `${xAxisId}-RS`;

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
        canvasHeight:
          height - (paddingBottom + paddingTop + 6) - rangeSelector.height,
        canvasWidth: width - (paddingLeft + paddingRight) - 2,
        chartHeight: height - (paddingBottom + paddingTop + 6),
        rangeSelectorRealHeight: rangeSelector.height - 2 * paddingBottom,
      });
    }
  }, [width, height, config.decimal, rangeSelector.height]);

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
  }, [yScaleFunction, config.canvasWidth]);

  useEffect(() => {
    if (xScaleFunction) {
      d3.select(`#${xAxisId}`).html("");
      let xAxis = d3
        .axisBottom(xScaleFunction)
        .ticks((config.canvasWidth ?? 0) / 100)
        .tickSize(config.canvasHeight ?? 0);
      d3.select(`#${xAxisId}`).append("g").call(xAxis);
      d3.select(`#${xAxisId} .domain`).remove();
      d3.selectAll(`#${xAxisId} g text`).attr("transform", "translate(0,7)");
      d3.selectAll(`#${xAxisId} .tick line`).style("stroke", colors.grid);
      d3.selectAll(`#${xAxisId} .tick text`).style("fill", colors.tick);
    }
  }, [xScaleFunction, config.canvasWidth, config.canvasHeight]);

  useEffect(() => {
    if (rangeSelector.enable) {
      if (RSYScaleFunction) {
        d3.select(`#${yAxisIdRS}`).html("");
        let yAxis = d3
          .axisRight(RSYScaleFunction)
          .tickSize(config.canvasWidth ?? 0)
          .ticks(config.rangeSelectorRealHeight / 30);
        d3.select(`#${yAxisIdRS}`).append("g").call(yAxis);
        d3.select(`#${yAxisIdRS} .domain`).remove();
        d3.selectAll(`#${yAxisIdRS} g text`).attr(
          "transform",
          "translate(5,0)",
        );
        d3.selectAll(`#${yAxisIdRS} .tick line`).style("stroke", colors.grid);
        d3.selectAll(`#${yAxisIdRS} .tick text`).style("fill", colors.tick);
      }
    }
  }, [
    RSYScaleFunction,
    config.canvasWidth,
    rangeSelector.enable,
    config.rangeSelectorRealHeight,
  ]);

  useEffect(() => {
    if (rangeSelector.enable) {
      if (RSXScaleFunction) {
        d3.select(`#${xAxisIdRS}`).html("");
        let xAxis = d3
          .axisBottom(RSXScaleFunction)
          .ticks((config.canvasWidth ?? 0) / 100)
          .tickSize(config.rangeSelectorRealHeight ?? 0);
        d3.select(`#${xAxisIdRS}`).append("g").call(xAxis);
        d3.select(`#${xAxisIdRS} .domain`).remove();
        d3.selectAll(`#${xAxisIdRS} g text`).attr(
          "transform",
          "translate(0,10)",
        );
        d3.selectAll(`#${xAxisIdRS} .tick line`).style("stroke", colors.grid);
        d3.selectAll(`#${xAxisIdRS} .tick text`).style("fill", colors.tick);
      }
    }
  }, [xScaleFunction, config.canvasWidth, config.rangeSelectorRealHeight]);

  return (
    <div
      id={id}
      style={{
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        display: "inline-block",
        position: "relative",
        background: colors.background,
      }}
    >
      <SelectedCandleDataViewer
        decimal={decimal}
        dataViewerTexts={dataViewerTexts}
        dataViewerColors={dataViewerColors}
      />
      <svg
        width={config.canvasWidth}
        height={config.chartHeight}
        style={{ overflow: "inherit", cursor: "crosshair" }}
      >
        <g id={`${yAxisId}`}></g>
        <g id={`${xAxisId}`}></g>
        {chartElement as React.ReactNode}
        {rangeSelector.enable ? (
          <>
            <g
              id={`${yAxisIdRS}`}
              style={{
                transform: `translate(0,${config.canvasHeight ? config.canvasHeight + paddingBottom : 0}px`,
              }}
            ></g>
            <g
              id={`${xAxisIdRS}`}
              style={{
                transform: `translate(0,${config.canvasHeight ? config.canvasHeight + paddingBottom : 0}px`,
              }}
            ></g>
            <foreignObject
              width={config.canvasWidth}
              height={config.rangeSelectorRealHeight}
              id={`${id}-range-selector`}
              y={config.canvasHeight ? config.canvasHeight + paddingBottom : 0}
            >
              <RSChart
                id={id}
                RSXScaleFunction={RSXScaleFunction}
                RSYScaleFunction={RSYScaleFunction}
              />
            </foreignObject>
          </>
        ) : (
          <></>
        )}
        {children}
      </svg>
    </div>
  );
};

export default Layout;
