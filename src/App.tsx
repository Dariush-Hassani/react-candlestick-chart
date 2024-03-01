import React, { useEffect, useState } from "react";
import "./App.css";
import CandlestickChart from "./components/CandlestickChart";

function App() {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
    setWidth(window.innerWidth);
    setHeight(window.innerHeight - 50);
  }, []);
  return (
    <CandlestickChart
      data={[
        {
          date: "2018-10-22",
          open: 180.82,
          high: 181.4,
          low: 177.56,
          close: 178.75,
        },
        {
          date: "2018-10-23",
          open: 175.77,
          high: 179.49,
          low: 175.44,
          close: 178.53,
        },
      ]}
      id={"chart1"}
      width={width}
      height={height}
      decimal={3}
    />
  );
}

export default App;
