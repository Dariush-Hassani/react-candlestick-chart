## react-candlestick-chart
High performance, lightweight and interactive candlestick chart using the canvas tag, D3 and React.
## Installation

```bash
npm i react-candlestick-chart
```
## Demo
To discover all features, capabilities and source code, check out [Live Demo](https://dariush-hassani.github.io/react-candlestick-chart-demo)

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
### data - required
```javascript
data : any;

example:

[
  {
    date: "2018-10-23", //or 1540166400000 or "2018-10-22 03:30
    open: 182.47,
    high: 183.01,
    low: 177.39,
    close: 179.93,
    //position is optional
    position: {
        positionType: "long", // or "short"
        sl: 170, //stop loss
        tp: 190, // take profit
        positionValue: 180,
    },
  },
  {
    date: "2018-10-24",
    open: 180.82,
    high: 181.4,
    low: 177.56,
    close: 178.75,
  }
]
```

### id - required
```javascript
id: string;
 ```
### width - required
```javascript
width: number;
 ```

### height - required
```javascript
height: number;
 ```
###  decimal? - optional
decimal for price axis.
```javascript
decimal?: number; // default value = 0
 ```


### scrollZoom? - optional

```javascript
scrollZoom?: {
    enable: boolean;
    max: number;
};

/*
default value :
{
    enable: false,
    max: 1
}
*/
```

### rangeSelector? - optional
```javascript
rangeSelector?: {
  enable: boolean;
  height: number;
  initialRange?: {
    type: "month" | "day" | "hour" | "percent" | "milliseconds";
    value: number;
  };
};

/*
default value :
{
  enable: false;
  height: 0;
  initialRange?: {
    type: "percent";
    value: 100;
  };
}
*/
```

### responsiveBreakPoint? - optional

```javascript
responsiveBreakPoint?: number; // default value = 400 (px)
```

### enableResetButton? - optional
```javascript
enableResetButton?: boolean; // default value = true
```
### dataViewerTexts? - optional
```javascript
dataViewerTexts? : {
  shortPosition?: string;
  longPosition?: string;
  stopLoss?: string;
  takeProfit?: string;
  open?: string;
  high?: string;
  low?: string;
  close?: string;
}

/*
default value:
{
  shortPosition: "Short",
  longPosition: "Long",
  stopLoss: "sl",
  takeProfit: "tp",
  open: "O",
  high: "H",
  low: "L",
  close: "C",
}
*/
```

### dataViewerColors? - optional
```javascript
dataViewerColors? : {
  shortPositionLabel?: string;
  shortPositionData?: string;
  longPositionLabel?: string;
  longPositionData?: string;
  stopLossLabel?: string;
  stopLossData?: string;
  takeProfitLabel?: string;
  takeProfitData?: string;
  openLabel?: string;
  openDataUp?: string;
  openDataDown?: string;
  highLabel?: string;
  highDataUp?: string;
  highDataDown?: string;
  lowLabel?: string;
  lowDataUp?: string;
  lowDataDown?: string;
  closeLabel?: string;
  closeDataUp?: string;
  closeDataDown?: string;
}

/*
default value:
{
  shortPositionLabel: "#b2b5be",
  shortPositionData:"#fff",
  longPositionLabel:"#b2b5be",
  longPositionData: "#fff",
  stopLossLabel:"#b2b5be",
  stopLossData:"#F9DB04",
  takeProfitLabel:"#b2b5be",
  takeProfitData:"#04F5F9",
  openLabel:"#b2b5be",
  openDataUp:"#089981",
  openDataDown:"#e13443",
  highLabel:"#b2b5be",
  highDataUp:"#089981",
  highDataDown:"#e13443",
  lowLabel:"#b2b5be",
  lowDataUp:"#089981",
  lowDataDown:"#e13443",
  closeLabel:"#b2b5be",
  closeDataUp:"#089981",
  closeDataDown:"#e13443",
}
*/
```

### ColorPalette? - optional
```javascript
ColorPalette? : {
  background: string;
  grid?: string;
  tick?: string;
  selectorLine?: string;
  selectorLabelBackground?: string;
  selectorLabelText?: string;
  greenCandle?: string;
  redCandle?: string;
  longPosition?: string;
  shortPosition?: string;
  sl?: string;
  tp?: string;
  RSChartStroke?: string;
  RSChartOverlay?: string;
  RSChartOverlayResize?: string;
  resetButtonColor?: string;
}

/*
default value:
{
  background:"#161b26",
  grid:"#222631",
  tick:"#b2b5be",
  selectorLine:"rgba(178,181,190,0.5)",
  selectorLabelBackground:"#2a2e39",
  selectorLabelText:"#b2b5be",
  greenCandle:"#089981",
  redCandle:"#e13443",
  longPosition:"#fff",
  shortPosition:"#fff",
  sl:"#F9DB04",
  tp:"#04F5F9",
  RSChartStroke:"#04F5F9",
  RSChartOverlay:"#000",
  RSChartOverlayResize:"#e13443",
  resetButtonColor:"#04F5F9",            
}
*/
````

## License

[ISC](https://github.com/Dariush-Hassani/react-candlestick-chart/blob/main/LICENSE)