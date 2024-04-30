import React, { useEffect, useState } from "react";
import "./App.css";
import CandlestickChart from "./components/CandlestickChart";

function App() {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight - 50);
    });
    setWidth(window.innerWidth);
    setHeight(window.innerHeight - 50);
  }, []);
  return (
    <CandlestickChart
      data={data}
      id={"chart1"}
      width={width}
      height={height}
      decimal={3}
      scrollZoom={{
        enable: true,
        max: 20,
      }}
      rangeSelector={{
        enable: true,
        height: 150,
        initialRange: 30,
      }}
      responsiveBreakPoint={450}
    />
  );
}

const data = [
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
  {
    date: "2018-10-24",
    open: 178.58,
    high: 182.37,
    low: 176.31,
    close: 176.97,
  },
  {
    date: "2018-10-25",
    open: 177.52,
    high: 180.5,
    low: 176.83,
    close: 179.07,
  },
  {
    date: "2018-10-26",
    open: 176.88,
    high: 177.34,
    low: 170.91,
    close: 172.23,
    position: {
      positionType: "long",
      positionValue: 174,
    },
  },
  {
    date: "2018-10-29",
    open: 173.74,
    high: 175.99,
    low: 170.95,
    close: 173.2,
  },
  {
    date: "2018-10-30",
    open: 173.16,
    high: 176.43,
    low: 172.64,
    close: 176.24,
  },
  {
    date: "2018-10-31",
    open: 177.98,
    high: 178.85,
    low: 175.59,
    close: 175.88,
  },
  {
    date: "2018-11-01",
    open: 176.84,
    high: 180.86,
    low: 175.9,
    close: 180.46,
  },
  {
    date: "2018-11-02",
    open: 182.47,
    high: 183.01,
    low: 177.39,
    close: 179.93,
    position: {
      positionType: "long",
      sl: 170,
      tp: 190,
      positionValue: 180,
    },
  },
  {
    date: "2018-11-05",
    open: 181.02,
    high: 182.41,
    low: 179.3,
    close: 182.19,
  },
  {
    date: "2018-11-06",
    open: 181.93,
    high: 182.65,
    low: 180.05,
    close: 182.01,
  },
  {
    date: "2018-11-07",
    open: 183.79,
    high: 187.68,
    low: 182.06,
    close: 187.23,
    position: {
      positionType: "short",
      sl: 185,
      tp: 181,
      positionValue: 183,
    },
  },
  {
    date: "2018-11-08",
    open: 187.13,
    high: 188.69,
    low: 185.72,
    close: 188.0,
  },
  {
    date: "2018-11-09",
    open: 188.32,
    high: 188.48,
    low: 184.96,
    close: 185.99,
  },
  {
    date: "2018-11-12",
    open: 185.23,
    high: 186.95,
    low: 179.02,
    close: 179.43,
  },
  {
    date: "2018-11-13",
    open: 177.3,
    high: 181.62,
    low: 172.85,
    close: 179.0,
  },
  {
    date: "2018-11-14",
    open: 182.61,
    high: 182.9,
    low: 179.15,
    close: 179.9,
  },
  {
    date: "2018-11-15",
    open: 179.01,
    high: 179.67,
    low: 173.61,
    close: 177.36,
  },
  {
    date: "2018-11-16",
    open: 173.99,
    high: 177.6,
    low: 173.51,
    close: 177.02,
  },
  {
    date: "2018-11-19",
    open: 176.71,
    high: 178.88,
    low: 172.3,
    close: 173.59,
    position: {
      positionType: "short",
      sl: 185,
      tp: 165,
      positionValue: 175,
    },
  },
  {
    date: "2018-11-20",
    open: 169.25,
    high: 172.0,
    low: 167.0,
    close: 169.05,
  },
  {
    date: "2018-11-21",
    open: 170.0,
    high: 170.93,
    low: 169.15,
    close: 169.3,
  },
  {
    date: "2018-11-23",
    open: 169.39,
    high: 170.33,
    low: 168.47,
    close: 168.85,
  },
  {
    date: "2018-11-26",
    open: 170.2,
    high: 172.39,
    low: 168.87,
    close: 169.82,
  },
  {
    date: "2018-11-27",
    open: 169.11,
    high: 173.38,
    low: 168.82,
    close: 173.22,
    position: {
      positionType: "long",
      sl: 171,
      tp: 175,
      positionValue: 173,
    },
  },
  {
    date: "2018-11-28",
    open: 172.91,
    high: 177.65,
    low: 170.62,
    close: 177.43,
  },
  {
    date: "2018-11-29",
    open: 176.8,
    high: 177.27,
    low: 174.92,
    close: 175.66,
  },
  {
    date: "2018-11-30",
    open: 175.75,
    high: 180.37,
    low: 175.11,
    close: 180.32,
  },
  {
    date: "2018-12-03",
    open: 183.29,
    high: 183.5,
    low: 179.35,
    close: 181.74,
  },
  {
    date: "2018-12-04",
    open: 181.06,
    high: 182.23,
    low: 174.55,
    close: 175.3,
  },
  {
    date: "2018-12-06",
    open: 173.5,
    high: 176.04,
    low: 170.46,
    close: 175.96,
    position: {
      positionType: "short",
      sl: 178.81,
      tp: 172.21,
      positionValue: 176.21,
    },
  },
  {
    date: "2018-12-07",
    open: 175.35,
    high: 178.36,
    low: 172.24,
    close: 172.79,
  },
  {
    date: "2018-12-10",
    open: 173.39,
    high: 173.99,
    low: 167.73,
    close: 171.69,
  },
  {
    date: "2018-12-11",
    open: 174.3,
    high: 175.6,
    low: 171.24,
    close: 172.21,
  },
  {
    date: "2018-12-12",
    open: 173.75,
    high: 176.87,
    low: 172.81,
    close: 174.21,
  },
  {
    date: "2018-12-13",
    open: 174.31,
    high: 174.91,
    low: 172.07,
    close: 173.87,
  },
  {
    date: "2018-12-14",
    open: 172.98,
    high: 175.14,
    low: 171.95,
    close: 172.29,
  },
  {
    date: "2018-12-17",
    open: 171.51,
    high: 171.99,
    low: 166.93,
    close: 167.97,
  },
  {
    date: "2018-12-18",
    open: 168.9,
    high: 171.95,
    low: 168.5,
    close: 170.04,
  },
  {
    date: "2018-12-19",
    open: 170.92,
    high: 174.95,
    low: 166.77,
    close: 167.56,
  },
  {
    date: "2018-12-20",
    open: 166.28,
    high: 167.31,
    low: 162.23,
    close: 164.16,
  },
  {
    date: "2018-12-21",
    open: 162.81,
    high: 167.96,
    low: 160.17,
    close: 160.48,
  },
  {
    date: "2018-12-24",
    open: 160.16,
    high: 161.4,
    low: 158.09,
    close: 158.14,
  },
  {
    date: "2018-12-26",
    open: 159.46,
    high: 168.28,
    low: 159.44,
    close: 168.28,
  },
  {
    date: "2018-12-27",
    open: 166.44,
    high: 170.46,
    low: 163.36,
    close: 170.32,
  },
  {
    date: "2018-12-28",
    open: 171.22,
    high: 173.12,
    low: 168.6,
    close: 170.22,
  },
  {
    date: "2018-12-31",
    open: 171.47,
    high: 173.24,
    low: 170.65,
    close: 171.82,
  },
  {
    date: "2019-01-02",
    open: 169.71,
    high: 173.18,
    low: 169.05,
    close: 172.41,
  },
  {
    date: "2019-01-03",
    open: 171.84,
    high: 171.84,
    low: 168.21,
    close: 168.61,
  },
  {
    date: "2019-01-04",
    open: 170.18,
    high: 174.74,
    low: 169.52,
    close: 173.62,
  },
  {
    date: "2019-01-07",
    open: 173.83,
    high: 178.18,
    low: 173.83,
    close: 177.04,
  },
  {
    date: "2019-01-08",
    open: 178.57,
    high: 179.59,
    low: 175.61,
    close: 177.89,
  },
  {
    date: "2019-01-09",
    open: 177.87,
    high: 181.27,
    low: 177.1,
    close: 179.73,
  },
  {
    date: "2019-01-10",
    open: 178.03,
    high: 179.24,
    low: 176.34,
    close: 179.06,
  },
  {
    date: "2019-01-11",
    open: 177.93,
    high: 180.26,
    low: 177.12,
    close: 179.41,
  },
  {
    date: "2019-01-14",
    open: 177.59,
    high: 179.23,
    low: 176.9,
    close: 178.81,
  },
  {
    date: "2019-01-15",
    open: 176.08,
    high: 177.82,
    low: 175.2,
    close: 176.47,
  },
  {
    date: "2019-01-16",
    open: 177.09,
    high: 177.93,
    low: 175.86,
    close: 177.04,
  },
  {
    date: "2019-01-17",
    open: 174.01,
    high: 175.46,
    low: 172.0,
    close: 174.87,
  },
  {
    date: "2019-01-18",
    open: 176.98,
    high: 180.04,
    low: 176.18,
    close: 179.58,
  },
  {
    date: "2019-01-22",
    open: 177.49,
    high: 178.6,
    low: 175.36,
    close: 177.11,
  },
  {
    date: "2019-01-23",
    open: 176.59,
    high: 178.06,
    low: 174.53,
    close: 176.89,
  },
  {
    date: "2019-01-24",
    open: 177.0,
    high: 177.53,
    low: 175.3,
    close: 177.29,
  },
  {
    date: "2019-01-25",
    open: 179.78,
    high: 180.87,
    low: 178.61,
    close: 180.4,
  },
  {
    date: "2019-01-28",
    open: 178.97,
    high: 179.99,
    low: 177.41,
    close: 179.83,
  },
  {
    date: "2019-01-29",
    open: 178.96,
    high: 180.15,
    low: 178.09,
    close: 179.69,
  },
  {
    date: "2019-01-30",
    open: 180.47,
    high: 184.2,
    low: 179.78,
    close: 182.18,
  },
];

export default App;
