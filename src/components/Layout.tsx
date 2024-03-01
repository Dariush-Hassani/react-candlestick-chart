import React, { useEffect } from "react";
import { useData } from "../context/DataContext";
import {
  useConfigData,
  useConfigDispatch,
} from "../context/ConfigtDataContext";
import * as d3 from "d3";
import { colors } from "../utils/Colors";

const Layout: React.FC<{
  id: string;
  width: number;
  height: number;
  children: React.ReactNode;
  xScaleFunction: any;
  yScaleFunction: any;
}> = ({ id, width, height, yScaleFunction, xScaleFunction }) => {
  const yAxisId = `${id}-yAxis`;
  const data = useData();

  const config = useConfigData();
  const dispatchConfig = useConfigDispatch();

  const paddingLeft = 25;
  const paddingTop = 10;
  const paddingBottom = 30;
  const paddingRight =
    2.5 +
    data.minMaxInitPrice.max.toFixed(config.decimal).toString().length *
      config.characterFontWidth;

  useEffect(() => {
    if (width !== 0 && height !== 0) {
      dispatchConfig({
        type: "changeDiagramDimension",
        canvasHeight: height - (paddingBottom + paddingTop + 6),
        canvasWidth: width - (paddingLeft + paddingRight) - 2,
      });
    }
  }, [width, height, config.decimal]);

  useEffect(() => {
    if (yScaleFunction) {
      d3.select(`#${yAxisId}`).html("");
      let yAxis = d3
        .axisRight(yScaleFunction)
        .tickSize(config.canvasWidth ?? 0);
      d3.select(`#${yAxisId}`).append("g").call(yAxis);

      d3.select(`#${yAxisId} .domain`).remove();

      d3.selectAll(`#${yAxisId} g text`).attr("transform", "translate(5,0)");

      d3.selectAll(`#${yAxisId} .tick line`).style("stroke", colors.grid);
      d3.selectAll(`#${yAxisId} .tick text`).style("fill", colors.tick);
    }
  }, [yScaleFunction]);

  return (
    <div
      id={id}
      style={{
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        display: "inline-block",
      }}
    >
      <svg
        width={config.canvasWidth}
        height={config.canvasHeight}
        style={{ overflow: "inherit", cursor: "crosshair" }}
      >
        <g id={`${yAxisId}`}></g>
        <g id={`${id}-xAxis`}></g>
      </svg>
    </div>
  );
};

export default Layout;
