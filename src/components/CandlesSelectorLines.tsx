import React, { useEffect, useState } from "react";
import { getCursorPoint } from "../utils/helperFunctions";

const CandlesSelectorLines: React.FC<{
  candlesCanvasId: string;
}> = ({ candlesCanvasId }) => {
  const [showLines, setShowsLines] = useState<boolean>(false);

  useEffect(() => {
    function mouseMove(evt: MouseEvent) {
      let point = getCursorPoint(candlesCanvasId, evt);
      console.log(point.x, point.y);
    }

    let canvas: HTMLCanvasElement = document.querySelector(
      `#${candlesCanvasId}`,
    ) as HTMLCanvasElement;

    canvas.addEventListener("mousemove", mouseMove);

    return () => {
      canvas.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <>
      {showLines ? (
        <>
          <line id="xAxis-dataViewerLine"></line>
          <line id="yAxis-dataViewerLine"></line>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CandlesSelectorLines;
