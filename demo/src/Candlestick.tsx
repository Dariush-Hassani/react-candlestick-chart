import React from "react";
import CandlestickChart from "react-candlestick-chart";
import data from "./data";

const Candlestick: React.FC<{
  width: number;
  height: number;
}> = ({ width, height }) => {
  return (
    <CandlestickChart
      data={data}
      id={"chart1"}
      width={width}
      height={height}
      decimal={5}
      scrollZoom={{
        enable: true,
        max: 100,
      }}
      rangeSelector={{
        enable: true,
        height: 150,
        initialRange: { type: "month", value: 12 },
      }}
      responsiveBreakPoint={500}
    />
  );
};

export default Candlestick;
