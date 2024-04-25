import React, { useEffect, useState } from "react";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { DataContextType } from "../types/DataContextType";
import { useData } from "../context/DataContext";
import * as d3 from "d3";
import { colors } from "../utils/Colors";

const RSChart: React.FC<{
  id: string;
  RSXScaleFunction: any;
  RSYScaleFunction: any;
}> = ({ id, RSXScaleFunction, RSYScaleFunction }) => {
  const chartId = `${id}-RSChart`;
  const data: DataContextType = useData();
  const config: ConfigDataContextType = useConfigData();
  const [pathData, setPathData] = useState<string | null>();

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
    >
      <path
        stroke={colors.RSChartStroke}
        fill={"none"}
        strokeWidth={"2px"}
        d={pathData as string}
      ></path>
      <rect
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
        style={{ opacity: 0.3 }}
      ></rect>
      <rect
        x={RSXScaleFunction ? RSXScaleFunction(data.minMaxShownDate.min) : 0}
        y={config.rangeSelectorRealHeight / 4}
        height={config.rangeSelectorRealHeight / 2}
        width={4}
        fill={colors.RSChartOverlayResize}
        style={{ cursor: "e-resize" }}
      ></rect>
      <rect
        x={
          RSXScaleFunction
            ? RSXScaleFunction
              ? RSXScaleFunction(data.minMaxShownDate.max) - 4
              : 0
            : 0
        }
        y={config.rangeSelectorRealHeight / 4}
        height={config.rangeSelectorRealHeight / 2}
        width={4}
        fill={colors.RSChartOverlayResize}
        style={{ cursor: "e-resize" }}
      ></rect>
    </svg>
  );
};

export default RSChart;