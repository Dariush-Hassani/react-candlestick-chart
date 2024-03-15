import React, { useEffect, useState } from "react";
import { getCursorPoint } from "../utils/helperFunctions";
import * as d3 from "d3";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { colors } from "../utils/Colors";
const CandlesSelectorLines: React.FC<{
  candlesCanvasId: string;
  chartId: string;
}> = ({ candlesCanvasId, chartId }) => {
  const [showLines, setShowsLines] = useState<boolean>(false);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const priceViewerLineId = "priceViewerLine";
  const dateViewerLineId = "dateViewerLine";
  const config: ConfigDataContextType = useConfigData();

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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CandlesSelectorLines;
