import data from "./data";
import InfoModal from "./InfoModal";
import { useState } from "react";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className={"nav-box-mobile"}>
        <div>react-candlestick-chart ({data.length} candles)</div>
        <div>
          <div className={"info-btn"} onClick={() => setIsOpen(!isOpen)}>
            i
          </div>
        </div>
      </div>
      {isOpen ? <InfoModal /> : <></>}
    </>
  );
};
export default MobileNavbar;
