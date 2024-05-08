## react-candlestick-chart
High performance, lightweight and interactive candlestick chart using the <canvas> tag, D3 and React.
## Installation

```bash
npm i react-candlestick-chart
```
## Full Features Demo
[See Demo](https://dariush-hassani.github.io/react-candlestick-chart-demo)

## Basic Usage

```javascript
import CandlestickChart from 'react-candlestick-chart';

function App() {
  return (
      <CandlestickChart
        data={data}
        id={"chart1"}
        width={1000}
        height={400}
        decimal={2}
        scrollZoom={{
          enable: true,
          max: 20,
        }}
        rangeSelector={{
          enable: true,
          height: 150,
          initialRange: { type: "month", value: 1 },
        }}
        enableResetButton={true}
      />
  );
}

const data = [
  {
  date: "2018-10-22", //or 1540166400000 or "2018-10-22 03:30"
  open: 180.82,
  high: 181.4,
  low: 177.56,
  close: 178.75,
  },
  {
  date: "2018-10-23",
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
  date: "2018-10-24",
  open: 180.82,
  high: 181.4,
  low: 177.56,
  close: 178.75,
  },
  {
  date: "2018-10-25",
  open: 180.82,
  high: 181.4,
  low: 177.56,
  close: 178.75,
  },
  {
    date: "2018-10-26",
    open: 173.74,
    high: 175.99,
    low: 170.95,
    close: 173.2,
  },
  {
    date: "2018-10-27",
    open: 173.16,
    high: 176.43,
    low: 172.64,
    close: 176.24,
  },
  {
    date: "2018-10-28",
    open: 177.98,
    high: 178.85,
    low: 175.59,
    close: 175.88,
  },
  {
    date: "2018-10-29",
    open: 176.84,
    high: 180.86,
    low: 175.9,
    close: 180.46,
  },
];
```

## Props



## License

[ISC](https://github.com/Dariush-Hassani/react-candlestick-chart/blob/main/LICENSE)