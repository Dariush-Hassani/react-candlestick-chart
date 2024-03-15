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
  const priceViewerLineId = "priceViewerLine";
  const dateViewerLineId = "dateViewerLine";
  const config: ConfigDataContextType = useConfigData();

  const priceLineHandler = (positionY: number) => {
    d3.select(`#${priceViewerLineId}`)
      .attr("x1", 0)
      .attr("y1", positionY)
      .attr("x2", config.canvasWidth as number)
      .attr("y2", positionY);
  };
  const mouseMove = (evt: MouseEvent) => {
    setShowsLines(true);
    let point = getCursorPoint(candlesCanvasId, evt);
    priceLineHandler(point.y);
  };

  const mouseLeave = () => {
    setShowsLines(false);
  };

  useEffect(() => {
    if (config.canvasWidth === 0) return;

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
  }, [config.canvasWidth]);

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
