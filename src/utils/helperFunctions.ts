import DataType from "../types/DataType";

export const dateArrayNormalizer = (data: (string | number)[]): number[] => {
  try {
    if (data.length === 0) return [];
    let rv: number[] = [];
    data.forEach((date) => {
      if (typeof date === "string") rv.push(new Date(date).getTime());
      else rv.push(date);
    });
    return rv;
  } catch (error) {
    throw new Error("Data not suite for date array normalizer!");
  }
};

export const dataNormalizer = (data: any[]): DataType[] => {
  try {
    if (data.length === 0) return [];
    let rv: DataType[] = [];
    data.forEach((x) => {
      if (
        typeof x?.close !== "number" ||
        (typeof x?.date !== "number" && typeof x?.date !== "string") ||
        typeof x?.high !== "number" ||
        typeof x?.low !== "number" ||
        typeof x?.open !== "number"
      ) {
        throw new Error("Data not suite for this chart!");
      }
      if (
        x.position &&
        (!x.position.sl ||
          !x.position.tp ||
          !x.position.positionType ||
          !x.position.positionValue ||
          typeof x.position.sl !== "number" ||
          typeof x.position.tp !== "number" ||
          typeof x.position.positionType !== "string" ||
          (x.position.positionType !== "long" &&
            x.position.positionType !== "short") ||
          typeof x.position.positionValue !== "number")
      ) {
        throw new Error("Data not suite for this chart!");
      }
      rv.push({
        close: x.close,
        date: x.date,
        high: x.high,
        low: x.low,
        open: x.open,
        position: x?.position
          ? {
              sl: x?.position?.sl,
              tp: x?.position?.tp,
              positionType: x?.positionType,
              positionValue: x.positionValue,
            }
          : undefined,
      });
    });
    return rv;
  } catch (error) {
    throw new Error("Data not suite for this chart!");
  }
};

export const calculateCandleWidthDate = (
  times: number[],
): [candleWidth: number, candleLockerWidth: number] => {
  let indexes = [0, 1];
  let min = times[1] - times[0];
  for (let i = 1; i < times.length; i++) {
    if (times[i + 1] - times[i] < min) {
      min = times[i + 1] - times[i];
      indexes = [i, i + 1];
    }
  }

  let width = times[indexes[1]] - times[indexes[0]];
  return [width - 0.3 * width, width];
};

export const getCursorPoint = (
  id: string,
  evt: MouseEvent,
): { x: number; y: number } => {
  let canvas: HTMLCanvasElement = document.querySelector(
    `#${id}`,
  ) as HTMLCanvasElement;
  let rect: DOMRect = canvas.getBoundingClientRect(),
    root = document.documentElement;

  // return relative mouse position
  let mouseX: number = evt.clientX - rect.left - root.scrollLeft;
  let mouseY: number = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
};
