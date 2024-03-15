import React, { useEffect, useMemo, useState } from "react";
import { getCursorPoint } from "../utils/helperFunctions";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { colors } from "../utils/Colors";
import { DataContextType } from "../types/DataContextType";
import { useData } from "../context/DataContext";
const CandlesSelectorLines: React.FC<{
  candlesCanvasId: string;
  chartId: string;
  xScaleFunction: any;
  yScaleFunction: any;
}> = ({ candlesCanvasId, chartId, xScaleFunction, yScaleFunction }) => {
  const priceViewerLineId = "priceViewerLine";
  const dateViewerLineId = "dateViewerLine";
  const charWidth = 7.8;
  const priceLabelHeight = 25;

  const config: ConfigDataContextType = useConfigData();
  const data: DataContextType = useData();

  const [showLines, setShowsLines] = useState<boolean>(false);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);

  const [priceLabelTranslateY, setPriceLabelTranslateY] = useState<number>(0);
  const priceLabelWidth = useMemo<number>(
    () =>
      2.5 +
      data.minMaxInitPrice.max.toFixed(config.decimal).toString().length *
        charWidth,
    [config.decimal, data.minMaxInitPrice.max],
  );
  const [priceLabelValue, setPriceLabelValue] = useState<number>(0);

  const mouseMove = (evt: MouseEvent) => {
    setShowsLines(true);
    let point = getCursorPoint(candlesCanvasId, evt);
    setPositionX(point.x);
    setPositionY(point.y);
  };

  const mouseLeave = () => {
    setShowsLines(false);
  };

  useEffect(() => {
    let canvas: HTMLCanvasElement = document.querySelector(
      `#${candlesCanvasId}`,
    ) as HTMLCanvasElement;

    let mainSvgChart = document.querySelector(`#${chartId} svg`) as HTMLElement;

    mainSvgChart.addEventListener("mouseleave", mouseLeave);
    canvas.addEventListener("mousemove", mouseMove);

    return () => {
      canvas.removeEventListener("mouseleave", mouseLeave);
      mainSvgChart.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  useEffect(() => {
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
  }, [positionY, config.decimal]);

  return (
    <>
      {showLines ? (
        <>
          <line
            strokeDasharray={"2,2"}
            stroke={colors.selectorLine}
            id={dateViewerLineId}
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CandlesSelectorLines;
