import React from "react";
import { DataViewerTextsType } from "../types/DataViewerTextsType";
import { DataViewerColorsType } from "../types/DataViewerColorsType";
import { DataContextType } from "../types/DataContextType";
import { useData } from "../context/DataContext";
import { DataViewerAndSelectorsContextType } from "../types/DataViewerAndSelectorsContextType";
import { useDataViewerAndSelectors } from "../context/DataViewerAndSelectorsContext";
import { ConfigDataContextType } from "../types/ConfigDataContextType";
import { useConfigData } from "../context/ConfigtDataContext";
import { colors } from "../utils/Colors";

const SelectedCandleDataViewer: React.FC<{
  dataViewerTexts: DataViewerTextsType;
  dataViewerColors: DataViewerColorsType;
  decimal: number;
}> = ({ dataViewerTexts, dataViewerColors, decimal }) => {
  const data: DataContextType = useData();
  const dataViewer: DataViewerAndSelectorsContextType =
    useDataViewerAndSelectors();
  const showCandleInfo = dataViewer.candleIndex !== -1;
  const config: ConfigDataContextType = useConfigData();

  const selectedData = showCandleInfo
    ? data.shownData[dataViewer.candleIndex]
    : null;

  const isUp: boolean =
    showCandleInfo &&
    data.shownData[dataViewer.candleIndex]?.open >
      data.shownData[dataViewer.candleIndex]?.close;

  return (
    <>
      {showCandleInfo && !config.pan && dataViewer.showLines ? (
        <div>
          <div
            style={{
              position: "absolute",
              left: "25px",
              top: "10px",
              fontFamily: "monospace",
              display: config.isMobile ? "block" : "flex",
              gap: "10px",
            }}
          >
            <div
              style={{
                background: config.isMobile ? colors.background : "",
                padding: config.isMobile ? "4px 0" : "0",
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
            </div>
            <div
              style={{
                background: config.isMobile ? colors.background : "",
                padding: config.isMobile ? "4px 0" : "0",
              }}
            >
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
            </div>
            <div
              style={{
                background: config.isMobile ? colors.background : "",
                padding: config.isMobile ? "4px 0" : "0",
              }}
            >
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
            </div>
            <div
              style={{
                background: config.isMobile ? colors.background : "",
                padding: config.isMobile ? "4px 0" : "0",
              }}
            >
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
          </div>
          {selectedData && selectedData.position ? (
            <div
              style={{
                position: "absolute",
                left: "25px",
                top: config.isMobile ? "80px" : "30px",
                fontFamily: "monospace",
                display: config.isMobile ? "block" : "flex",
                gap: "10px",
              }}
            >
              <div
                style={{
                  background: config.isMobile ? colors.background : "",
                  padding: config.isMobile ? "4px 0" : "0",
                }}
              >
                <span
                  style={{
                    color:
                      selectedData.position.positionType === "short"
                        ? dataViewerColors.shortPositionLabel
                        : dataViewerColors.longPositionLabel,
                  }}
                >
                  {" "}
                  {selectedData.position.positionType === "short"
                    ? dataViewerTexts.shortPosition
                    : dataViewerTexts.longPosition}
                </span>
                <span
                  style={{
                    color:
                      selectedData.position.positionType === "short"
                        ? dataViewerColors.shortPositionData
                        : dataViewerColors.longPositionData,
                  }}
                >
                  {" "}
                  {selectedData.position.positionValue.toFixed(decimal)}
                </span>
              </div>
              {selectedData.position.sl ? (
                <div
                  style={{
                    background: config.isMobile ? colors.background : "",
                    padding: config.isMobile ? "4px 0" : "0",
                  }}
                >
                  <span
                    style={{
                      color: dataViewerColors.stopLossLabel,
                    }}
                  >
                    {" "}
                    {dataViewerTexts.stopLoss}
                  </span>
                  <span
                    style={{
                      color: dataViewerColors.stopLossData,
                    }}
                  >
                    {" "}
                    {selectedData.position.sl.toFixed(decimal)}
                  </span>
                </div>
              ) : (
                <></>
              )}
              {selectedData.position.tp ? (
                <div
                  style={{
                    background: config.isMobile ? colors.background : "",
                    padding: config.isMobile ? "4px 0" : "0",
                  }}
                >
                  <span
                    style={{
                      color: dataViewerColors.takeProfitLabel,
                    }}
                  >
                    {" "}
                    {dataViewerTexts.takeProfit}
                  </span>
                  <span
                    style={{
                      color: dataViewerColors.takeProfitData,
                    }}
                  >
                    {" "}
                    {selectedData.position.tp.toFixed(decimal)}
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SelectedCandleDataViewer;
