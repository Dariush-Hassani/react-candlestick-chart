import React, { useEffect } from "react";
import { useData } from "../context/DataContext";
import {
  useConfigData,
  useConfigDispatch,
} from "../context/ConfigtDataContext";

const Layout: React.FC<{
  id: string;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ id, width, height }) => {
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

  return (
    <div
      id={id}
      style={{
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        display: "inline-block",
        background: "red",
      }}
    >
      <svg
        width={config.canvasWidth}
        height={config.canvasHeight}
        style={{ overflow: "inherit", cursor: "crosshair", background: "blue" }}
      ></svg>
    </div>
  );
};

export default Layout;
