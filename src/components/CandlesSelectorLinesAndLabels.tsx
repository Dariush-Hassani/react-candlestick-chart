import React, { Dispatch, useEffect, useMemo, useRef, useState } from "react";
import {
  findCandleIndex,
  getCursorPoint,
  getTouchPoint,
} from "../utils/helperFunctions";
import {
  ConfigDataActionType,
  ConfigDataContextType,
} from "../types/ConfigDataContextType";
import {
  useConfigData,
  useConfigDispatch,
} from "../context/ConfigtDataContext";
import { DataActionType, DataContextType } from "../types/DataContextType";
import { useData, useDataDispatch } from "../context/DataContext";
import * as d3 from "d3";
import {
  useDataViewerAndSelectors,
  useDataViewerAndSelectorsDispatch,
} from "../context/DataViewerAndSelectorsContext";
import {
  DataViewerAndSelectorsActionType,
  DataViewerAndSelectorsContextType,
} from "../types/DataViewerAndSelectorsContextType";
import { ColorsType } from "../types/ColorsType";
import { useColors } from "../context/ColorsContext";
const CandlesSelectorLinesAndLabels: React.FC<{
  candlesCanvasId: string;
  chartId: string;
  xScaleFunction: any;
  yScaleFunction: any;
  scrollZoom: {
    enable: boolean;
    max: number;
  };
}> = ({
  candlesCanvasId,
  chartId,
  xScaleFunction,
  yScaleFunction,
  scrollZoom,
}) => {
  const priceViewerLineId = "priceViewerLine";
  const dateViewerLineId = "dateViewerLine";
  const charWidth = 7.8;
  const priceLabelHeight = 25;
  const dateLabelWidth = 150;
  const dateLabelHeight = 25;

  const colors: ColorsType = useColors();

  const config: ConfigDataContextType = useConfigData();
  const data: DataContextType = useData();
  const dispatchDataViewer: Dispatch<DataViewerAndSelectorsActionType> =
    useDataViewerAndSelectorsDispatch();

  const dataViewer: DataViewerAndSelectorsContextType =
    useDataViewerAndSelectors();

  const dispatchData: Dispatch<DataActionType> = useDataDispatch();
  const dispatchConfigData: Dispatch<ConfigDataActionType> =
    useConfigDispatch();

  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [updateZoom, setUpdateZoom] = useState<"down" | "up" | false>(false);
  const [onRSChart, setOnRSChart] = useState<boolean>(false);

  const [panTarget, setPanTarget] = useState<number>(0);
  const [panDateWidth, setPanDateWidth] = useState<number>(0);

  const [priceLabelTranslateY, setPriceLabelTranslateY] = useState<number>(0);
  const priceLabelWidth = useMemo<number>(
    () =>
      2.5 +
      data.minMaxInitPrice.max.toFixed(config.decimal).toString().length *
        charWidth,
    [config.decimal, data.minMaxInitPrice.max],
  );
  const [priceLabelValue, setPriceLabelValue] = useState<number>(0);

  const [dateLabelTranslateX, setDateLabelTranslateX] = useState<number>(0);
  const [dateLabelValue, setDateLabelValue] = useState<string>("");

  const [dateLinePosition, setDateLinePosition] = useState<number>(0);

  const [firstRender, setFirstRender] = useState<boolean>(true);

  const zoomTouchDistanceStart = useRef<number>(0);
  const zoomTouchDistanceEnd = useRef<number>(0);
  const currentZoom = useRef<number>(0);
  const inTouchZoom = useRef<boolean>(false);

  const mouseMove = (evt: MouseEvent) => {
    dispatchDataViewer({ type: "changeShowLines", showLines: true });
    let point = getCursorPoint(candlesCanvasId, evt);
    setPositionX(point.x);
    setPositionY(point.y);
  };

  const touchMove = (evt: TouchEvent) => {
    evt.preventDefault();
    dispatchDataViewer({ type: "changeShowLines", showLines: false });
    if (evt.touches.length === 1 && !inTouchZoom.current) {
      dispatchConfigData({ type: "changePan", pan: true });
      if (config.pan) {
        let point = getTouchPoint(candlesCanvasId, evt);
        setPositionX(point.x);
        setPositionY(point.y);
      }
      dispatchDataViewer({ type: "changeCandleIndex", candleIndex: -1 });
    } else if (evt.touches.length === 2) {
      inTouchZoom.current = true;
      zoomTouchDistanceEnd.current = Math.hypot(
        evt.touches[0].pageX - evt.touches[1].pageX,
        evt.touches[0].pageY - evt.touches[1].pageY,
      );
      let diff = zoomTouchDistanceStart.current - zoomTouchDistanceEnd.current;
      let coeffDiff = parseInt((diff / 3).toFixed(0));
      if (coeffDiff > currentZoom.current) {
        currentZoom.current = coeffDiff;
        setUpdateZoom("down");
      } else if (coeffDiff < currentZoom.current) {
        currentZoom.current = coeffDiff;
        setUpdateZoom("up");
      }
    }
  };

  const touchEnd = (evt: TouchEvent) => {
    evt.preventDefault();
    inTouchZoom.current = false;
    dispatchConfigData({ type: "changePan", pan: false });
    zoomTouchDistanceStart.current = 0;
    zoomTouchDistanceEnd.current = 0;
    currentZoom.current = 0;
  };

  const touchStart = (evt: TouchEvent) => {
    if (onRSChart) return;
    let point = getTouchPoint(candlesCanvasId, evt);
    setPositionX(point.x);
    setPositionY(point.y);
    if (evt.touches.length === 1) {
      dispatchDataViewer({ type: "changeShowLines", showLines: true });
    } else if (evt.touches.length === 2) {
      zoomTouchDistanceStart.current = Math.hypot(
        evt.touches[0].pageX - evt.touches[1].pageX,
        evt.touches[0].pageY - evt.touches[1].pageY,
      );
    }
  };

  const mouseLeave = () => {
    dispatchDataViewer({ type: "changeShowLines", showLines: false });
    dispatchConfigData({ type: "changePan", pan: false });
    dispatchDataViewer({ type: "changeCandleIndex", candleIndex: -1 });
  };

  const mouseWheel = (evt: WheelEvent) => {
    if (onRSChart) return;
    setUpdateZoom(evt.deltaY > 0 ? "up" : "down");
  };

  const mouseEnterRSChart = () => {
    setOnRSChart(true);
  };

  const mouseEnterCanvas = () => {
    setOnRSChart(false);
  };

  const canvasMouseDown = () => {
    dispatchConfigData({ type: "changePan", pan: true });
  };

  const canvasMouseUp = () => {
    dispatchConfigData({ type: "changePan", pan: false });
    dispatchDataViewer({ type: "changeCandleIndex", candleIndex: -1 });
  };

  useEffect(() => {
    let canvas: HTMLCanvasElement = document.querySelector(
      `#${candlesCanvasId}`,
    ) as HTMLCanvasElement;

    let mainSvgChart = document.querySelector(`#${chartId} svg`) as HTMLElement;

    let rangeSelector = document.querySelector(
      `#${chartId}-range-selector`,
    ) as HTMLElement;

    canvas?.addEventListener("mousemove", mouseMove);
    canvas?.addEventListener("mouseenter", mouseEnterCanvas);
    canvas?.addEventListener("touchstart", mouseEnterCanvas);

    mainSvgChart?.addEventListener("mousedown", canvasMouseDown);
    mainSvgChart?.addEventListener("mouseup", canvasMouseUp);
    mainSvgChart?.addEventListener("mouseleave", mouseLeave);
    mainSvgChart?.addEventListener("wheel", mouseWheel, { passive: true });

    rangeSelector?.addEventListener("mousemove", mouseLeave);
    rangeSelector?.addEventListener("touchmove", mouseLeave);
    rangeSelector?.addEventListener("touchstart", mouseEnterRSChart);
    rangeSelector?.addEventListener("mouseenter", mouseEnterRSChart);

    canvas?.addEventListener("touchmove", touchMove);
    mainSvgChart?.addEventListener("touchstart", touchStart);
    mainSvgChart?.addEventListener("touchend", touchEnd);

    return () => {
      canvas?.removeEventListener("touchmove", touchMove);
      mainSvgChart?.removeEventListener("touchstart", touchStart);
      mainSvgChart?.removeEventListener("touchend", touchEnd);

      canvas?.removeEventListener("mousemove", mouseMove);
      canvas?.removeEventListener("mouseenter", mouseEnterCanvas);
      canvas?.removeEventListener("touchstart", mouseEnterCanvas);

      mainSvgChart?.removeEventListener("mousedown", canvasMouseDown);
      mainSvgChart?.removeEventListener("mouseup", canvasMouseUp);
      mainSvgChart?.removeEventListener("mouseleave", mouseLeave);
      mainSvgChart?.removeEventListener("wheel", mouseWheel);

      rangeSelector?.removeEventListener("mousemove", mouseLeave);
      rangeSelector?.removeEventListener("mouseenter", mouseEnterRSChart);
      rangeSelector?.removeEventListener("touchmove", mouseLeave);
      rangeSelector?.removeEventListener("touchstart", mouseEnterRSChart);
    };
  }, [onRSChart, config.pan]);

  useEffect(() => {
    if (config.canvasWidth && config.canvasHeight) {
      let translateY =
        positionY >= (config.canvasHeight as number) - priceLabelHeight / 2
          ? (config.canvasHeight as number) - priceLabelHeight
          : positionY <= priceLabelHeight / 2
            ? 0
            : positionY - priceLabelHeight / 2;
      setPriceLabelTranslateY(translateY);

      let priceLabelValue =
        yScaleFunction?.invert(positionY).toFixed(config.decimal) ?? 0;
      setPriceLabelValue(priceLabelValue);
    }
  }, [positionY, config.decimal, config.canvasWidth, config.canvasHeight]);

  useEffect(() => {
    if (config.canvasWidth) {
      let selectedCandleIndex = findCandleIndex(
        data.shownData,
        data.candleLockerWidthDate,
        xScaleFunction.invert(positionX).getTime(),
      );

      dispatchDataViewer({
        type: "changeCandleIndex",
        candleIndex: selectedCandleIndex,
      });

      let posX =
        selectedCandleIndex === -1
          ? positionX
          : xScaleFunction(data.shownData[selectedCandleIndex].date);

      setDateLinePosition(posX);

      let translateX =
        posX >= (config.canvasWidth as number) - dateLabelWidth / 2
          ? (config.canvasWidth as number) - dateLabelWidth
          : posX <= dateLabelWidth / 2
            ? 0
            : posX - dateLabelWidth / 2;
      setDateLabelTranslateX(translateX);

      let dateLabelValue = d3.timeFormat("%a %d %b '%y %H:%M")(
        xScaleFunction.invert(posX),
      );
      setDateLabelValue(dateLabelValue);
    }
  }, [
    positionX,
    config.canvasWidth,
    data.candleLockerWidthDate,
    dateLabelWidth,
    config.pan,
  ]);

  useEffect(() => {
    if (positionX) setFirstRender(false);
  }, [positionX]);

  useEffect(() => {
    if (!updateZoom || !xScaleFunction || !config.canvasWidth) return;

    if (updateZoom && scrollZoom.enable && !firstRender) {
      if (
        updateZoom === "up" &&
        data.zoomFactor * data.incrementZoomFactor > scrollZoom.max
      )
        return;
      dispatchDataViewer({ type: "changeShowLines", showLines: false });
      let target =
        dataViewer.candleIndex === -1
          ? xScaleFunction.invert(positionX).getTime()
          : data.shownData[dataViewer.candleIndex].date;
      dispatchDataViewer({ type: "changeCandleIndex", candleIndex: -1 });
      let newZoomFactor = (data.zoomFactor *=
        updateZoom === "up"
          ? data.incrementZoomFactor
          : data.decrementZoomFactor);
      let newWidthInDate = Math.round(
        (data.minMaxInitDate.max - data.minMaxInitDate.min) / newZoomFactor,
      );
      let coefficient = Math.round(
        (newWidthInDate * positionX) / config.canvasWidth,
      );
      setUpdateZoom(false);
      dispatchData({
        type: "changeShownRange",
        shownRange: {
          start: target - coefficient,
          end: target - coefficient + newWidthInDate,
        },
      });
    }
  }, [updateZoom, xScaleFunction, config.canvasWidth, firstRender]);

  useEffect(() => {
    if (config.pan) {
      setPanTarget(xScaleFunction?.invert(positionX));
      setPanDateWidth(data.minMaxShownDate.max - data.minMaxShownDate.min);
    } else {
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
  }, [config.pan]);

  useEffect(() => {
    if (config.pan) {
      let fraction = positionX / (config.canvasWidth as number);
      let startShownDate = panTarget - fraction * panDateWidth;
      let endShownDate = startShownDate + panDateWidth;

      dispatchData({
        type: "changeShownRange",
        shownRange: { start: startShownDate, end: endShownDate },
      });
    }
  }, [positionX]);

  return (
    <>
      {dataViewer.showLines && !config.pan ? (
        <>
          <line
            strokeDasharray={"2,2"}
            stroke={colors.selectorLine}
            id={dateViewerLineId}
            x1={dateLinePosition}
            y1={0}
            x2={dateLinePosition}
            y2={config.canvasHeight}
          ></line>
          <line
            x1={0}
            y1={positionY}
            x2={config.canvasWidth}
            y2={positionY}
            strokeDasharray={"2,2"}
            stroke={colors.selectorLine}
            id={priceViewerLineId}
          ></line>
          <g
            transform={`translate(${config.canvasWidth},${priceLabelTranslateY})`}
          >
            <rect
              fill={colors.selectorLabelBackground}
              width={priceLabelWidth}
              height={priceLabelHeight}
            ></rect>
            <text
              style={{
                fontSize: "12px",
                fill: colors.selectorLabelText,
                fontFamily: "monospace",
              }}
              x={5}
              y={15}
            >
              {priceLabelValue}
            </text>
          </g>
          <g
            transform={`translate(${dateLabelTranslateX},${config.canvasHeight})`}
          >
            <rect
              fill={colors.selectorLabelBackground}
              width={dateLabelWidth}
              height={dateLabelHeight}
            ></rect>
            <text
              style={{
                fontSize: "12px",
                fill: colors.selectorLabelText,
                fontFamily: "monospace",
              }}
              x={5}
              y={15}
            >
              {dateLabelValue}
            </text>
          </g>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CandlesSelectorLinesAndLabels;
