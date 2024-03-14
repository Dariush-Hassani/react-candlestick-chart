import React from "react";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";

const CandlesCanvas: React.FC<{
  id: string;
}> = ({ id }) => {
  const config: ConfigDataContextType = useConfigData();

  return (
    <canvas
      width={config.canvasWidth}
      height={config.canvasHeight}
      id={id}
    ></canvas>
  );
};

export default CandlesCanvas;
