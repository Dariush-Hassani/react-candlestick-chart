import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { DataContextType } from "../types/DataContextType";
import { useData } from "../context/DataContext";
import dataType from "../types/DataType";
import { ColorsType } from "../types/ColorsType";
import { useColors } from "../context/ColorsContext";

const CandlesCanvas: React.FC<{
  id: string;
  xScaleFunction: any;
  yScaleFunction: any;
}> = ({ id, xScaleFunction, yScaleFunction }) => {
  const config: ConfigDataContextType = useConfigData();
  const data: DataContextType = useData();
  const context2D = useRef<CanvasRenderingContext2D | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scale = 3;
  const colors: ColorsType = useColors();
  const [candleWidth, setCandleWidth] = useState<number>(0);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const calcCandleWidth = (
    minMaxShownDate: { min: number; max: number },
    candleWidthDate: number,
  ) => {
    let candleWidth: number =
      xScaleFunction(minMaxShownDate.min + candleWidthDate) -
      xScaleFunction(minMaxShownDate.min);

    candleWidth = Number.isNaN(candleWidth) ? 0 : candleWidth;
    return candleWidth;
  };

  const createCandle = (candleWidth: number, candleData: dataType) => {
    if (Number.isNaN(candleWidth) || !candleWidth) return;
    let ctx = context2D.current as CanvasRenderingContext2D;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

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

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.stroke(candle);
    ctx.fill(candle);

    //position / sl / tp
    if (candleData.position) {
      let position = new Path2D();
      if (candleData.position.positionType === "long") {
        //long position
        position.moveTo(
          xScaleFunction(candleData.date) - candleWidth / 2,
          yScaleFunction(candleData.position.positionValue),
        );
        position.lineTo(
          xScaleFunction(candleData.date) + candleWidth / 2,
          yScaleFunction(candleData.position.positionValue),
        );
        position.lineTo(
          xScaleFunction(candleData.date),
          yScaleFunction(candleData.position.positionValue) -
            (candleWidth / 1.5 > 20 ? 20 : candleWidth / 1.5),
        );
        ctx.fillStyle = colors.longPosition;
        ctx.strokeStyle = colors.longPosition;
      } else if (candleData.position.positionType === "short") {
        position.moveTo(
          xScaleFunction(candleData.date) - candleWidth / 2,
          yScaleFunction(candleData.position.positionValue),
        );
        position.lineTo(
          xScaleFunction(candleData.date) + candleWidth / 2,
          yScaleFunction(candleData.position.positionValue),
        );
        position.lineTo(
          xScaleFunction(candleData.date),
          yScaleFunction(candleData.position.positionValue) +
            (candleWidth / 1.5 > 20 ? 20 : candleWidth / 1.5),
        );
        ctx.fillStyle = colors.shortPosition;
        ctx.strokeStyle = colors.shortPosition;
      }
      ctx.stroke(position);
      ctx.fill(position);

      //sl
      if (candleData.position.sl) {
        let sl = new Path2D();
        sl.rect(
          xScaleFunction(candleData.date) - candleWidth / 1.2,
          yScaleFunction(candleData.position.sl),
          candleWidth * 1.6,
          3,
        );
        ctx.fillStyle = colors.sl;
        ctx.strokeStyle = colors.sl;
        ctx.stroke(sl);
        ctx.fill(sl);
      }

      //tp
      if (candleData.position.tp) {
        let tp = new Path2D();
        tp.rect(
          xScaleFunction(candleData.date) - candleWidth / 1.2,
          yScaleFunction(candleData.position.tp),
          candleWidth * 1.6,
          3,
        );
        ctx.fillStyle = colors.tp;
        ctx.strokeStyle = colors.tp;
        ctx.stroke(tp);
        ctx.fill(tp);
      }
    }
  };

  useLayoutEffect(() => {
    if (canvas.current) {
      context2D.current = canvas.current.getContext("2d");
    }
  }, [canvas.current]);

  useEffect(() => {
    if (firstRender && xScaleFunction && yScaleFunction) {
      let candleWidth: number = calcCandleWidth(
        data.minMaxShownDate,
        data.candleWidthDate,
      );

      if (candleWidth > 0) {
        setCandleWidth(candleWidth);
        setFirstRender(false);
      }
    }
  }, [
    data.shownData,
    data.candleWidthDate,
    config.canvasWidth,
    config.canvasHeight,
    xScaleFunction,
    yScaleFunction,
  ]);
  useEffect(() => {
    if (firstRender) return;

    let candleWidth: number = calcCandleWidth(
      data.minMaxShownDate,
      data.candleWidthDate,
    );

    setCandleWidth(candleWidth);
  }, [
    data.shownData,
    data.candleWidthDate,
    config.canvasWidth,
    config.canvasHeight,
    firstRender,
  ]);

  useEffect(() => {
    if (context2D.current && candleWidth > 0 && config.canvasHeight) {
      context2D.current?.clearRect(
        0,
        0,
        config.canvasWidth as number,
        config.canvasHeight as number,
      );
      if (data.shownData.length && !Number.isNaN(candleWidth)) {
        for (let i = 0; i < data.shownData.length; i++)
          createCandle(candleWidth, data.shownData[i]);
      }
    }
  }, [
    context2D.current,
    candleWidth,
    data.candleWidthDate,
    config.canvasWidth,
    config.canvasHeight,
    xScaleFunction,
    yScaleFunction,
  ]);

  return (
    <canvas
      width={(config.canvasWidth as number) * scale}
      height={(config.canvasHeight as number) * scale}
      ref={canvas}
      id={id}
      style={{
        width: config.canvasWidth + "px",
        height: config.canvasHeight + "px",
        cursor: config.pan ? "all-scroll" : "",
      }}
    ></canvas>
  );
};

export default CandlesCanvas;
