const InfoModal = () => {
  return (
    <div className={"nav-container-mobile"}>
      <a
        href={"https://github.com/Dariush-Hassani/react-candlestick-chart"}
        target="_blank"
      >
        <div>
          <img
            alt="git"
            src="https://raw.githubusercontent.com/Dariush-Hassani/react-candlestick-chart/refs/heads/main/demo/public/gitHubLogo.svg"
          />
          &nbsp;source-code (demo)
        </div>
      </a>
      <a
        href={"https://www.npmjs.com/package/react-candlestick-chart"}
        style={{ width: "160px" }}
        target="_blank"
      >
        <div>
          <img
            alt="npm"
            src="https://raw.githubusercontent.com/Dariush-Hassani/react-candlestick-chart/refs/heads/main/demo/public/npm.svg"
          />
          &nbsp;npm package
        </div>
      </a>
      <a
        href={"https://github.com/Dariush-Hassani/react-candlestick-chart"}
        target="_blank"
      >
        <div>
          <img
            alt="git"
            src="https://raw.githubusercontent.com/Dariush-Hassani/react-candlestick-chart/refs/heads/main/demo/public/gitHubLogo.svg"
          />
          &nbsp;github repository
        </div>
      </a>
    </div>
  );
};

export default InfoModal;
