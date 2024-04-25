import React, { Dispatch, useEffect, useMemo, useState } from "react";
import { findCandleIndex, getCursorPoint } from "../utils/helperFunctions";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { colors } from "../utils/Colors";
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

  const config: ConfigDataContextType = useConfigData();
  const data: DataContextType = useData();
  const dispatchDataViewer: Dispatch<DataViewerAndSelectorsActionType> =
    useDataViewerAndSelectorsDispatch();

  const dataViewer: DataViewerAndSelectorsContextType =
    useDataViewerAndSelectors();

  const dispatchData: Dispatch<DataActionType> = useDataDispatch();

  const [showLines, setShowsLines] = useState<boolean>(false);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [updateZoom, setUpdateZoom] = useState<"down" | "up" | false>(false);
  const [onRSChart, setOnRSChart] = useState<boolean>(false);

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

  const mouseMove = (evt: MouseEvent) => {
    setShowsLines(true);
    let point = getCursorPoint(candlesCanvasId, evt);
    setPositionX(point.x);
    setPositionY(point.y);
  };

  const mouseLeave = () => {
    setShowsLines(false);
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

  useEffect(() => {
    let canvas: HTMLCanvasElement = document.querySelector(
      `#${candlesCanvasId}`,
    ) as HTMLCanvasElement;

    let mainSvgChart = document.querySelector(`#${chartId} svg`) as HTMLElement;

    let rangeSelector = document.querySelector(
      `#${chartId}-range-selector`,
    ) as HTMLElement;

    mainSvgChart.addEventListener("mouseleave", mouseLeave);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseenter", mouseEnterCanvas);
    mainSvgChart.addEventListener("wheel", mouseWheel);
    rangeSelector?.addEventListener("mousemove", mouseLeave);
    rangeSelector?.addEventListener("mouseenter", mouseEnterRSChart);

    return () => {
      canvas.removeEventListener("mouseleave", mouseLeave);
      canvas.removeEventListener("mouseenter", mouseEnterCanvas);
      mainSvgChart.removeEventListener("mouseleave", mouseLeave);
      mainSvgChart.removeEventListener("wheel", mouseWheel);
      rangeSelector?.removeEventListener("mousemove", mouseLeave);
      rangeSelector?.removeEventListener("mouseenter", mouseEnterRSChart);
    };
  }, [onRSChart]);

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
    if (config.canvasWidth && config.canvasHeight) {
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
  }, [positionX, config.decimal, config.canvasWidth, config.canvasHeight]);

  useEffect(() => {
    if (!updateZoom || !xScaleFunction || !config.canvasWidth) return;

    if (updateZoom && scrollZoom.enable) {
      if (
        updateZoom === "up" &&
        data.zoomFactor * data.incrementZoomFactor > scrollZoom.max
      )
        return;
      setShowsLines(false);
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
  }, [updateZoom, xScaleFunction, config.canvasWidth]);

  return (
    <>
      {showLines ? (
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
