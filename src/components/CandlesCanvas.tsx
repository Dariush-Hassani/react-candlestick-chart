import React, { useEffect, useMemo } from "react";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { DataContextType } from "../types/DataContextType";
import { useData } from "../context/DataContext";

const CandlesCanvas: React.FC<{
  id: string;
  xScaleFunction: any;
  yScaleFunction: any;
}> = ({ id, xScaleFunction, yScaleFunction }) => {
  const config: ConfigDataContextType = useConfigData();
  const data: DataContextType = useData();

  const [candleLockerWidth, candleWidth] = useMemo<number[]>(() => {
    let lockerWidth: number =
      xScaleFunction(data.minMaxShownDate.min + data.candleLockerWidthDate) -
      xScaleFunction(data.minMaxShownDate.min);
    return [lockerWidth, lockerWidth - 0.3 * lockerWidth];
  }, [
    data.candleLockerWidthDate,
    data.candleWidthDate,
    config.canvasWidth,
    config.canvasHeight,
  ]);
  console.log(candleLockerWidth ?? 0, candleWidth ?? 0);
  return (
    <canvas
      width={config.canvasWidth}
      height={config.canvasHeight}
      id={id}
    ></canvas>
  );
};

export default CandlesCanvas;
