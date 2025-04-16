import Navbar from "./Navbar";
import Candlestick from "./Candlestick";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import MobileNavbar from "./MobileNavbar";

const App = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const [isResponsive, setIsResponsive] = useState<number>(0);

  const resizeHandler = () => {
    setWidth(
      window.visualViewport
        ? (window.visualViewport?.width as number)
        : window.innerWidth,
    );
    setHeight(
      window.visualViewport
        ? (window.visualViewport?.height as number)
        : window.innerHeight,
    );
    setIsResponsive(
      window.visualViewport
        ? window.visualViewport?.width < 970
          ? 1
          : 2
        : window.innerWidth < 970
          ? 1
          : 2,
    );
  };
  useEffect(() => {
    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);
  return (
    <>
      {isResponsive === 1 ? (
        <MobileNavbar />
      ) : isResponsive === 2 ? (
        <Navbar />
      ) : (
        <></>
      )}{" "}
      <Candlestick
        width={width}
        height={isResponsive === 1 ? height - 70 : height - 80}
      />
      <Footer />
    </>
  );
};

export default App;
