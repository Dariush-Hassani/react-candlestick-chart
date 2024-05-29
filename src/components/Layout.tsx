import React, { Dispatch, SVGProps, useEffect, useMemo, useState } from "react";
import { useData, useDataDispatch } from "../context/DataContext";
import {
  useConfigData,
  useConfigDispatch,
} from "../context/ConfigtDataContext";
import * as d3 from "d3";
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from "../types/ConfigDataContextType";
import { DataActionType, DataContextType } from "../types/DataContextType";
import SelectedCandleDataViewer from "./SelectedCandleDataViewer";
import { DataViewerTextsType } from "../types/DataViewerTextsType";
import { DataViewerColorsType } from "../types/DataViewerColorsType";
import RSChart from "./RSChart";
import dataType from "../types/DataType";
import { DataViewerAndSelectorsActionType } from "../types/DataViewerAndSelectorsContextType";
import { useDataViewerAndSelectorsDispatch } from "../context/DataViewerAndSelectorsContext";
import { ColorsType } from "../types/ColorsType";
import { useColors } from "../context/ColorsContext";

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
  candlesCanvasId: string;
  chartElement: SVGProps<SVGForeignObjectElement>;
  responsiveBreakPoint: number;
  enableResetButton: boolean;
  rangeSelector: {
    enable: boolean;
    height: number;
    initialRange: {
      type: "month" | "day" | "hour" | "percent" | "milliseconds";
      value: number;
    };
  };
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
  chartElement,
  RSYScaleFunction,
  RSXScaleFunction,
  candlesCanvasId,
  responsiveBreakPoint,
  enableResetButton,
  rangeSelector,
}) => {
  const yAxisId = `${id}-yAxis`;
  const xAxisId = `${id}-xAxis`;
  const yAxisIdRS = `${yAxisId}-RS`;
  const xAxisIdRS = `${xAxisId}-RS`;

  const resetBtnId = `${id}-reset-btn`;

  const colors: ColorsType = useColors();

  const [reset, setReset] = useState<boolean>(false);
  const [resetInitialize, setResetInitialize] = useState<boolean>(false);

  const dispatchConfig: Dispatch<ConfigDataActionType> = useConfigDispatch();
  const dispatchData: Dispatch<DataActionType> = useDataDispatch();

  const dispatchDataViewer: Dispatch<DataViewerAndSelectorsActionType> =
    useDataViewerAndSelectorsDispatch();

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

  const initialRangeCalculator = (
    initialRange: {
      type: "month" | "day" | "hour" | "percent" | "milliseconds";
      value: number;
    },
    initData: dataType[],
    candleWidthDate: number,
    candleLockerWidthDate: number,
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

      let nCandle = Math.ceil(rangeInMilliSeconds / candleLockerWidthDate);

      let lastDate = initData[initData.length - 1].date;
      let startDate = lastDate - (nCandle - 1) * candleLockerWidthDate;

      let startRange = startDate - candleWidthDate / 2;
      let endRange = lastDate + candleWidthDate / 2;

      dispatchData({
        type: "changeShownRange",
        shownRange: {
          start: startRange,
          end: endRange,
        },
      });
    }
  };

  let resetHandler = () => {
    initialRangeCalculator(
      rangeSelector.initialRange,
      data.initData,
      data.candleWidthDate,
      data.candleLockerWidthDate,
    );
    dispatchDataViewer({ type: "changeShowLines", showLines: false });

    setReset(true);
  };

  useEffect(() => {
    if (reset) {
      setTimeout(() => {
        dispatchData({
          type: "changeShownRange",
          shownRange: {
            start: data.shownRange.start + 1,
            end: data.shownRange.end,
          },
        });
      }, 10);
      setReset(false);
    }
  }, [reset, data.shownRange]);

  useEffect(() => {
    if (
      !resetInitialize &&
      rangeSelector.initialRange &&
      data.initData.length > 2 &&
      data.candleWidthDate > 0
    ) {
      initialRangeCalculator(
        rangeSelector.initialRange,
        data.initData,
        data.candleWidthDate,
        data.candleLockerWidthDate,
      );
      dispatchDataViewer({ type: "changeShowLines", showLines: false });
      setResetInitialize(true);
    }

    let resetBtn = document.getElementById(`${resetBtnId}`);

    if (resetBtn) {
      resetBtn.addEventListener("click", resetHandler);
    }

    return () => {
      if (resetBtn) {
        resetBtn.removeEventListener("click", resetHandler);
      }
    };
  }, [
    rangeSelector.initialRange,
    data.initData,
    data.candleWidthDate,
    resetInitialize,
  ]);

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
    dispatchConfig({
      type: "changeIsMobile",
      isMobile: width < responsiveBreakPoint,
    });
  }, [width, height, responsiveBreakPoint]);

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
      {enableResetButton ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "0",
            justifyContent: "end",
          }}
        >
          <div
            style={{
              marginTop: "10px",
              position: "relative",
              zIndex: 10,
              cursor: "pointer",
              borderRadius: 2,
              border: "1px solid",
              borderColor: `${colors.resetButtonColor}`,
              color: `${colors.resetButtonColor}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              fontFamily: "monospace",
              fontSize: "12px",
              padding: "10px",
            }}
            id={`${resetBtnId}`}
          >
            Reset
          </div>
        </div>
      ) : (
        <></>
      )}
      <SelectedCandleDataViewer
        decimal={decimal}
        dataViewerTexts={dataViewerTexts}
        dataViewerColors={dataViewerColors}
      />
      <svg
        width={config.canvasWidth}
        height={config.chartHeight}
        style={{ overflow: "inherit", cursor: "crosshair", userSelect: "none" }}
      >
        <g id={`${yAxisId}`}></g>
        <g id={`${xAxisId}`}></g>
        {chartElement as React.ReactNode}
        {rangeSelector.enable ? (
          <>
            <g
              id={`${yAxisIdRS}`}
              style={{
                transform: `translate(0,${
                  config.canvasHeight ? config.canvasHeight + paddingBottom : 0
                }px`,
              }}
            ></g>
            <g
              id={`${xAxisIdRS}`}
              style={{
                transform: `translate(0,${
                  config.canvasHeight ? config.canvasHeight + paddingBottom : 0
                }px`,
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
                candlesCanvasId={candlesCanvasId}
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
