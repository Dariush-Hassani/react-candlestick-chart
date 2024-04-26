import React, { Dispatch, useEffect, useState } from "react";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { DataActionType, DataContextType } from "../types/DataContextType";
import { useData, useDataDispatch } from "../context/DataContext";
import * as d3 from "d3";
import { colors } from "../utils/Colors";
import { getCursorPoint } from "../utils/helperFunctions";

const RSChart: React.FC<{
  id: string;
  RSXScaleFunction: any;
  RSYScaleFunction: any;
  candlesCanvasId: string;
}> = ({ id, RSXScaleFunction, RSYScaleFunction, candlesCanvasId }) => {
  const chartId = `${id}-RSChart`;
  const data: DataContextType = useData();
  const dispatchData: Dispatch<DataActionType> = useDataDispatch();
  const config: ConfigDataContextType = useConfigData();
  const leftPanId = `${chartId}-left-pan`;
  const rightPanId = `${chartId}-right-pan`;
  const [pathData, setPathData] = useState<string | null>();
  const [leftPan, setLeftPan] = useState<boolean>(false);
  const [rightPan, setRightPan] = useState<boolean>(false);
  const [positionX, setPositionX] = useState<number>(0);

  const mouseMove = (evt: MouseEvent) => {
    let point = getCursorPoint(candlesCanvasId, evt);
    setPositionX(point.x);
  };

  const leftPanMouseDown = () => setLeftPan(true);
  const rightPanMouseDown = () => setRightPan(true);
  const panMouseUp = () => {
    setLeftPan(false);
    setRightPan(false);
  };

  useEffect(() => {
    let RSChart = document.querySelector(`#${chartId}`) as HTMLElement;
    let leftPanBtn = document.querySelector(`#${leftPanId}`) as HTMLElement;
    let rightPanBtn = document.querySelector(`#${rightPanId}`) as HTMLElement;

    leftPanBtn.addEventListener("mousedown", leftPanMouseDown);
    leftPanBtn.addEventListener("mouseup", panMouseUp);
    rightPanBtn.addEventListener("mousedown", rightPanMouseDown);
    rightPanBtn.addEventListener("mouseup", panMouseUp);
    RSChart.addEventListener("mouseup", panMouseUp);
    RSChart.addEventListener("mouseleave", panMouseUp);
    RSChart.addEventListener("mousemove", mouseMove);

    return () => {
      leftPanBtn.removeEventListener("mousedown", leftPanMouseDown);
      leftPanBtn.removeEventListener("mouseup", panMouseUp);
      rightPanBtn.removeEventListener("mousedown", rightPanMouseDown);
      rightPanBtn.removeEventListener("mouseup", panMouseUp);
      RSChart.removeEventListener("mouseup", panMouseUp);
      RSChart.removeEventListener("mouseleave", panMouseUp);
      RSChart.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  useEffect(() => {
    if (leftPan) {
      let newLeftShownDate = RSXScaleFunction.invert(positionX).getTime();
      if (newLeftShownDate < data.minMaxInitDate.min) return;
      if (
        newLeftShownDate >=
        data.minMaxShownDate.max - data.candleLockerWidthDate
      )
        return;
      dispatchData({
        type: "changeShownRange",
        shownRange: { start: newLeftShownDate, end: data.shownRange.end },
      });
    } else if (rightPan) {
      let newRightShownDate = RSXScaleFunction.invert(positionX).getTime();
      if (newRightShownDate > data.minMaxInitDate.max) return;
      if (
        newRightShownDate <=
        data.minMaxShownDate.min + data.candleLockerWidthDate
      )
        return;
      dispatchData({
        type: "changeShownRange",
        shownRange: { start: data.shownRange.start, end: newRightShownDate },
      });
    }
  }, [positionX]);

  useEffect(() => {
    const points: [number, number][] = [];
    for (let i = 0; i < data.initData.length; i++) {
      points.push([
        data.initData[i].date,
        (data.initData[i].high + data.initData[i].low) / 2,
      ]);
    }
    let lineGenerator = d3.line().curve(d3.curveCardinal);
    lineGenerator
      .x(function (d) {
        return RSXScaleFunction(d[0]);
      })
      .y(function (d) {
        return RSYScaleFunction(d[1]);
      });
    setPathData(lineGenerator(points));
  }, [
    RSXScaleFunction,
    RSYScaleFunction,
    config.canvasWidth,
    config.rangeSelectorRealHeight,
  ]);

  return (
    <svg
      id={chartId}
      width={config.canvasWidth}
      height={config.rangeSelectorRealHeight}
      style={{ cursor: leftPan || rightPan ? "e-resize" : "" }}
    >
      <path
        stroke={colors.RSChartStroke}
        fill={"none"}
        strokeWidth={"2px"}
        d={pathData as string}
      ></path>
      <rect
        x={RSXScaleFunction ? RSXScaleFunction(data.minMaxShownDate.min) : 0}
        y={0}
        width={
          RSXScaleFunction
            ? RSXScaleFunction(data.minMaxShownDate.max) -
              RSXScaleFunction(data.minMaxShownDate.min)
            : 0
        }
        height={config.rangeSelectorRealHeight}
        fill={colors.RSChartOverlay}
        style={{ opacity: 0.3 }}
      ></rect>
      <rect
        x={RSXScaleFunction ? RSXScaleFunction(data.minMaxShownDate.min) : 0}
        y={config.rangeSelectorRealHeight / 4}
        height={config.rangeSelectorRealHeight / 2}
        width={4}
        fill={colors.RSChartOverlayResize}
        style={{ cursor: "e-resize" }}
        id={leftPanId}
      ></rect>
      <rect
        x={
          RSXScaleFunction
            ? RSXScaleFunction
              ? RSXScaleFunction(data.minMaxShownDate.max) - 4
              : 0
            : 0
        }
        y={config.rangeSelectorRealHeight / 4}
        height={config.rangeSelectorRealHeight / 2}
        width={4}
        fill={colors.RSChartOverlayResize}
        style={{ cursor: "e-resize" }}
        id={rightPanId}
      ></rect>
    </svg>
  );
};

export default RSChart;
