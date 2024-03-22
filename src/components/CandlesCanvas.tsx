import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { DataContextType } from "../types/DataContextType";
import { useData } from "../context/DataContext";
import DataType from "../types/DataType";
import dataType from "../types/DataType";
import { colors } from "../utils/Colors";

const CandlesCanvas: React.FC<{
  id: string;
  xScaleFunction: any;
  yScaleFunction: any;
}> = ({ id, xScaleFunction, yScaleFunction }) => {
  const config: ConfigDataContextType = useConfigData();
  const data: DataContextType = useData();
  const context2D = useRef<CanvasRenderingContext2D | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const createCandle = (
    candleWidth: number,
    candleLockerWidth: number,
    candleData: dataType,
  ) => {
    //candle body
    let width = candleWidth;
    let height =
      candleData.open > candleData.close
        ? yScaleFunction(candleData.close) - yScaleFunction(candleData.open)
        : yScaleFunction(candleData.open) - yScaleFunction(candleData.close);
    let x = xScaleFunction(candleData.date) - candleWidth / 2;
    let y =
      candleData.open > candleData.close
        ? yScaleFunction(candleData.open)
        : yScaleFunction(candleData.close);

    const candle = new Path2D();
    candle.rect(x, y, width, height);

    //candle high
    candle.moveTo(
      xScaleFunction(candleData.date),
      yScaleFunction(candleData.high),
    );
    candle.lineTo(xScaleFunction(candleData.date), y);

    //candle low
    candle.moveTo(
      xScaleFunction(candleData.date),
      yScaleFunction(candleData.low),
    );
    candle.lineTo(xScaleFunction(candleData.date), y + height);

    let color =
      candleData.open > candleData.close
        ? colors.greenCandle
        : colors.redCandle;
    let ctx = context2D.current as CanvasRenderingContext2D;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.stroke(candle);
    ctx.fill(candle);
  };

  useLayoutEffect(() => {
    if (canvas.current) {
      context2D.current = canvas.current.getContext("2d");
    }
  }, [canvas.current]);

  const [candleLockerWidth, candleWidth] = useMemo<number[]>(() => {
    if (!xScaleFunction || !yScaleFunction) return [0, 0];

    let lockerWidth: number =
      xScaleFunction(data.minMaxShownDate.min + data.candleLockerWidthDate) -
      xScaleFunction(data.minMaxShownDate.min);
    return [lockerWidth, lockerWidth - 0.3 * lockerWidth];
  }, [
    data.candleLockerWidthDate,
    data.candleWidthDate,
    config.canvasWidth,
    config.canvasHeight,
    xScaleFunction,
    yScaleFunction,
  ]);

  useEffect(() => {
    if (context2D.current) {
      for (let i = 0; i < data.shownData.length; i++)
        createCandle(candleWidth, candleLockerWidth, data.shownData[i]);
    }
  }, [context2D.current, candleLockerWidth, candleWidth, data.shownData]);

  return (
    <canvas
      width={config.canvasWidth}
      height={config.canvasHeight}
      ref={canvas}
      id={id}
    ></canvas>
  );
};

export default CandlesCanvas;
