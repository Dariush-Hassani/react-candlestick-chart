import data from "./data";

const Navbar = () => {
  return (
    <div className={"nav-box"}>
      <div>Demo for react-candlestick-chart ({data.length} candles)</div>
      <div className={"nav-container"}>
        <a
          href={
            "https://github.com/Dariush-Hassani/react-candlestick-chart-demo"
          }
          target="_blank"
        >
          <div>
            <img
              alt="git"
              src="https://raw.githubusercontent.com/Dariush-Hassani/react-candlestick-chart-demo/main/public/gitHubLogo.svg"
            />
            &nbsp;source-code (demo)
          </div>
        </a>
        <div> | </div>
        <a
          href={"https://www.npmjs.com/package/react-candlestick-chart"}
          style={{ width: "120px" }}
          target="_blank"
        >
          <div>
            <img
              alt="npm"
              src="https://raw.githubusercontent.com/Dariush-Hassani/react-candlestick-chart-demo/main/public/npm.svg"
            />
            &nbsp;npm package
          </div>
        </a>
        <div> | </div>
        <a
          href={"https://github.com/Dariush-Hassani/react-candlestick-chart"}
          target="_blank"
        >
          <div>
            <img
              alt="git"
              src="https://raw.githubusercontent.com/Dariush-Hassani/react-candlestick-chart-demo/main/public/gitHubLogo.svg"
            />
            &nbsp;github repository
          </div>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
