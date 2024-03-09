import React from "react";
import CandlestickChartController from "./CandlestickChartController";
import { ConfigDataProvider } from "../context/ConfigtDataContext";
import { DataProvider } from "../context/DataContext";
import { DataViewerAndSelectorsProvider } from "../context/DataViewerAndSelectorsContext";

const CandlestickChart: React.FC<{
  data: any;
  id: string;
  width: number;
  height: number;
  decimal?: number;
}> = ({ data, id, width, height, decimal }) => {
  return (
    <DataProvider>
      <ConfigDataProvider>
        <DataViewerAndSelectorsProvider>
          <CandlestickChartController
            chartData={data}
            id={id}
            width={width}
            height={height}
            decimal={decimal}
          />
        </DataViewerAndSelectorsProvider>
      </ConfigDataProvider>
    </DataProvider>
  );
};

export default CandlestickChart;
