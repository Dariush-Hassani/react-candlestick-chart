import React, { Dispatch, useEffect, useState } from "react";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { DataActionType, DataContextType } from "../types/DataContextType";
import { useData, useDataDispatch } from "../context/DataContext";
import * as d3 from "d3";
import { getCursorPoint, getTouchPoint } from "../utils/helperFunctions";
import { ColorsType } from "../types/ColorsType";
import { useColors } from "../context/ColorsContext";

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
  const panId = `${chartId}-pan`;
  const [pathData, setPathData] = useState<string | null>();
  const [leftPan, setLeftPan] = useState<boolean>(false);
  const [rightPan, setRightPan] = useState<boolean>(false);
  const [pan, setPan] = useState<boolean>(false);
  const [panTarget, setPanTarget] = useState<number>(0);
  const [positionX, setPositionX] = useState<number>(0);
  const [leftDistanceToTarget, setLeftDistanceToTarget] = useState<number>(0);
  const [panAreaWidth, setPanAreaWidth] = useState<number>(0);
  const [sizer, setSizer] = useState<number>(4);

  const colors: ColorsType = useColors();
  useEffect(() => {
    if (config.isMobile) {
      setSizer(10);
    } else {
      setSizer(4);
    }
  }, [config.isMobile]);

  const mouseMove = (evt: MouseEvent) => {
    let point = getCursorPoint(candlesCanvasId, evt);
    setPositionX(point.x);
  };

  const touchMove = (evt: TouchEvent) => {
    if (!pan) {
      setPan(true);
    }
    let point = getTouchPoint(candlesCanvasId, evt);
    setPositionX(point.x);
  };

  const touchStart = (evt: TouchEvent) => {
    let point = getTouchPoint(candlesCanvasId, evt);
    setPositionX(point.x);
  };

  const touchEnd = () => setPan(false);

  const leftPanMouseDown = () => setLeftPan(true);
  const rightPanMouseDown = () => setRightPan(true);
  const panMouseDown = () => setPan(true);
  const panMouseUp = () => {
    setLeftPan(false);
    setRightPan(false);
    setPan(false);
  };

  useEffect(() => {
    let RSChart = document.querySelector(`#${chartId}`) as HTMLElement;
    let leftPanBtn = document.querySelector(`#${leftPanId}`) as HTMLElement;
    let rightPanBtn = document.querySelector(`#${rightPanId}`) as HTMLElement;
    let panArea = document.querySelector(`#${panId}`) as HTMLElement;

    panArea.addEventListener("mousedown", panMouseDown);
    leftPanBtn.addEventListener("mousedown", leftPanMouseDown);
    leftPanBtn.addEventListener("touchstart", leftPanMouseDown);
    leftPanBtn.addEventListener("mouseup", panMouseUp);
    leftPanBtn.addEventListener("touchend", panMouseUp);
    rightPanBtn.addEventListener("mousedown", rightPanMouseDown);
    rightPanBtn.addEventListener("touchstart", rightPanMouseDown);
    rightPanBtn.addEventListener("mouseup", panMouseUp);
    rightPanBtn.addEventListener("touchend", panMouseUp);
    RSChart.addEventListener("mouseup", panMouseUp);
    RSChart.addEventListener("mouseleave", panMouseUp);
    RSChart.addEventListener("mousemove", mouseMove);
    RSChart.addEventListener("touchmove", touchMove);
    RSChart.addEventListener("touchstart", touchStart);
    RSChart.addEventListener("touchend", touchEnd);

    return () => {
      panArea.removeEventListener("mousedown", panMouseDown);
      leftPanBtn.removeEventListener("mousedown", leftPanMouseDown);
      leftPanBtn.removeEventListener("touchstart", leftPanMouseDown);
      leftPanBtn.removeEventListener("mouseup", panMouseUp);
      leftPanBtn.removeEventListener("touchend", panMouseUp);
      rightPanBtn.removeEventListener("mousedown", rightPanMouseDown);
      rightPanBtn.removeEventListener("touchstart", rightPanMouseDown);
      rightPanBtn.removeEventListener("mouseup", panMouseUp);
      rightPanBtn.removeEventListener("touchend", panMouseUp);
      RSChart.removeEventListener("mouseup", panMouseUp);
      RSChart.removeEventListener("mouseleave", panMouseUp);
      RSChart.removeEventListener("mousemove", mouseMove);
      RSChart.removeEventListener("touchmove", touchMove);
      RSChart.removeEventListener("touchstart", touchStart);
      RSChart.removeEventListener("touchend", touchEnd);
    };
  }, [pan]);

  useEffect(() => {
    if (pan) {
      setPanTarget(positionX);
      setLeftDistanceToTarget(
        positionX - RSXScaleFunction(data.minMaxShownDate.min),
      );
      setPanAreaWidth(data.minMaxShownDate.max - data.minMaxShownDate.min);
    } else {
      setPanTarget(0);
      setLeftDistanceToTarget(0);
      if (data.shownRange.start && data.shownRange.end) {
        dispatchData({
          type: "changeShownRange",
          shownRange: {
            start: data.shownRange.start,
            end: data.shownRange.end,
          },
        });
      }
    }
  }, [pan]);

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
    } else if (panTarget !== 0) {
      let leftTarget = positionX - leftDistanceToTarget;
      let leftTargetDate = RSXScaleFunction.invert(leftTarget).getTime();
      dispatchData({
        type: "changeShownRange",
        shownRange: {
          start: leftTargetDate,
          end: leftTargetDate + panAreaWidth,
        },
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
        id={panId}
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
        style={{ opacity: 0.3, cursor: "all-scroll" }}
      ></rect>
      <rect
        x={RSXScaleFunction ? RSXScaleFunction(data.minMaxShownDate.min) : 0}
        y={config.rangeSelectorRealHeight / 4}
        height={config.rangeSelectorRealHeight / 2}
        width={sizer}
        fill={colors.RSChartOverlayResize}
        style={{ cursor: "e-resize" }}
        id={leftPanId}
      ></rect>
      <rect
        x={
          RSXScaleFunction
            ? RSXScaleFunction
              ? RSXScaleFunction(data.minMaxShownDate.max) - sizer
              : 0
            : 0
        }
        y={config.rangeSelectorRealHeight / 4}
        height={config.rangeSelectorRealHeight / 2}
        width={sizer}
        fill={colors.RSChartOverlayResize}
        style={{ cursor: "e-resize" }}
        id={rightPanId}
      ></rect>
    </svg>
  );
};

export default RSChart;
