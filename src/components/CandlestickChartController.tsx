import { useDataDispatch } from "../context/DataContext";
import Layout from "./Layout";
import React, { useEffect } from "react";
import { useConfigDispatch } from "../context/ConfigtDataContext";

const CandlestickChartController: React.FC<{
  chartData: any;
  id: string;
  width: number;
  height: number;
  decimal?: number;
}> = ({ chartData, id, width, height, decimal }) => {
  const dispatchData = useDataDispatch();
  const dispatchConfig = useConfigDispatch();

  useEffect(() => {
    dispatchData({
      type: "changeInitData",
      initData: chartData,
    });
  }, [chartData]);
  useEffect(() => {
    dispatchConfig({
      type: "changeDecimal",
      decimal: decimal ?? 0,
    });
  }, [decimal]);

  return (
    <Layout id={id} width={width} height={height}>
      <div></div>
    </Layout>
  );
};
export default CandlestickChartController;
