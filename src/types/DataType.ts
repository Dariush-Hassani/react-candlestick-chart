type DataType = {
  date: number;
  open: number;
  close: number;
  high: number;
  low: number;
  position?: {
    sl: number;
    tp: number;
    positionType: "long" | "short";
    positionValue: number;
  };
};

export default DataType;
