import { useState } from "react";

const CandlesSelector = () => {
  const [showLines, setShowsLines] = useState<boolean>(false);

  return (
    <>
      {showLines ? (
        <>
          <line id="xAxis-dataViewerLine"></line>
          <line id="yAxis-dataViewerLine"></line>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CandlesSelector;
