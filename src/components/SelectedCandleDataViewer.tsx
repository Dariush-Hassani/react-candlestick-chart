import React from "react";
import { DataViewerTextsType } from "../types/DataViewerTextsType";
import { DataViewerColorsType } from "../types/DataViewerColorsType";
import { DataContextType } from "../types/DataContextType";
import { useData } from "../context/DataContext";
import { DataViewerAndSelectorsContextType } from "../types/DataViewerAndSelectorsContextType";
import { useDataViewerAndSelectors } from "../context/DataViewerAndSelectorsContext";

const SelectedCandleDataViewer: React.FC<{
  dataViewerTexts: DataViewerTextsType;
  dataViewerColors: DataViewerColorsType;
  decimal: number;
}> = ({ dataViewerTexts, dataViewerColors, decimal }) => {
  const data: DataContextType = useData();
  const selectedCandleIndex: DataViewerAndSelectorsContextType =
    useDataViewerAndSelectors();
  const showCandleInfo = selectedCandleIndex.candleIndex !== -1;

  const selectedData = showCandleInfo
    ? data.shownData[selectedCandleIndex.candleIndex]
    : null;

  const isUp: boolean =
    showCandleInfo &&
    data.shownData[selectedCandleIndex.candleIndex].open >
      data.shownData[selectedCandleIndex.candleIndex].close;

  return (
    <>
      {showCandleInfo ? (
        <div
          style={{
            position: "absolute",
            left: "25px",
            top: "10px",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: dataViewerColors.openLabel }}>
            {dataViewerTexts.open}
          </span>
          <span
            style={{
              color: isUp
                ? dataViewerColors.openDataUp
                : dataViewerColors.openDataDown,
            }}
          >
            {" "}
            {selectedData?.open.toFixed(decimal)}{" "}
          </span>
          <span style={{ color: dataViewerColors.highLabel }}>
            {dataViewerTexts.high}
          </span>
          <span
            style={{
              color: isUp
                ? dataViewerColors.highDataUp
                : dataViewerColors.highDataDown,
            }}
          >
            {" "}
            {selectedData?.high.toFixed(decimal)}{" "}
          </span>
          <span style={{ color: dataViewerColors.lowLabel }}>
            {dataViewerTexts.low}
          </span>
          <span
            style={{
              color: isUp
                ? dataViewerColors.lowDataUp
                : dataViewerColors.lowDataDown,
            }}
          >
            {" "}
            {selectedData?.low.toFixed(decimal)}{" "}
          </span>
          <span style={{ color: dataViewerColors.closeLabel }}>
            {dataViewerTexts.close}
          </span>
          <span
            style={{
              color: isUp
                ? dataViewerColors.closeDataUp
                : dataViewerColors.closeDataDown,
            }}
          >
            {" "}
            {selectedData?.close.toFixed(decimal)}{" "}
          </span>
        </div>
      ) : (
        <></>
      )}
      <div
        style={{
          position: "absolute",
          left: "25px",
          top: "30px",
          fontFamily: "monospace",
        }}
      ></div>
    </>
  );
};

export default SelectedCandleDataViewer;
