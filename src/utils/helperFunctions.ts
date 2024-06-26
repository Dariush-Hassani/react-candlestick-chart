import DataType from "../types/DataType";
import dataType from "../types/DataType";

export const stringDateNormalizer = (dateTime: string): string => {
  let normalDateTime = dateTime.trim();
  let splitDateTime1 = normalDateTime.split(" ");
  let splitDateTime2 = normalDateTime.split("T");

  let hasTime1 = splitDateTime1.length === 2;
  let hasTime2 = splitDateTime2.length === 2;

  let newDate: string;
  let newTime = "";

  if (hasTime1) {
    newDate = splitDateTime1[0];
    newTime = splitDateTime1[1];
  } else if (hasTime2) {
    newDate = splitDateTime2[0];
    newTime = splitDateTime2[1];
  } else {
    newDate = normalDateTime;
  }

  //normalizeDate
  let splitDate = newDate.split("-");

  if (splitDate.length !== 3) throw new Error("Invalid Date");

  let year = parseInt(splitDate[0]);
  let month = parseInt(splitDate[1]);
  let day = parseInt(splitDate[2]);

  let rv = "";

  let rvDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  rv += rvDate;

  if (newTime !== "") {
    let splitTime = newTime.split(":");
    if (splitTime.length !== 2) throw new Error("Invalid Time");

    let hours = parseInt(splitTime[0]);
    let minutes = parseInt(splitTime[1]);

    let rvTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;

    rv += "T" + rvTime;
  }
  return rv;
};
export const dateArrayNormalizer = (data: (string | number)[]): number[] => {
  try {
    if (data.length === 0) return [];
    let rv: number[] = [];
    data.forEach((date) => {
      if (typeof date === "string") {
        let nDate = stringDateNormalizer(date);
        rv.push(new Date(nDate).getTime());
      } else rv.push(date);
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
        (!x.position.positionType ||
          !x.position.positionValue ||
          (x.position.sl && typeof x.position.sl !== "number") ||
          (x.position.tp && typeof x.position.tp !== "number") ||
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
              positionType: x?.position?.positionType,
              positionValue: x?.position?.positionValue,
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

export const getTouchPoint = (
  id: string,
  evt: TouchEvent,
): { x: number; y: number } => {
  let canvas: HTMLCanvasElement = document.querySelector(
    `#${id}`,
  ) as HTMLCanvasElement;
  let rect: DOMRect = canvas.getBoundingClientRect(),
    root = document.documentElement;

  // return relative mouse position
  let mouseX: number = evt.touches[0].clientX - rect.left - root.scrollLeft;
  let mouseY: number = evt.touches[0].clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
};

// export const findCandleIndex = (inpArray: number[], key: number): number => {
//   let lowIndex = 0;
//   let highIndex = inpArray.length - 1;
//   let midIndex = Math.floor((highIndex + lowIndex) / 2);
//   while (true) {
//     if (key === inpArray[midIndex]) return midIndex;
//
//     if (lowIndex >= highIndex) {
//       return -1;
//     } else if (key > inpArray[midIndex]) {
//       lowIndex = midIndex + 1;
//       midIndex = Math.floor((highIndex + lowIndex) / 2);
//     } else if (key < inpArray[midIndex]) {
//       highIndex = midIndex - 1;
//       midIndex = Math.floor((highIndex + lowIndex) / 2);
//     }
//   }
// };

export const findCandleIndex = (
  inpArray: dataType[],
  candleLockerWidthDate: number,
  keyDate: number,
): number => {
  let lowIndex = 0;
  let highIndex = inpArray.length - 1;
  let midIndex = Math.floor((highIndex + lowIndex) / 2);
  while (true) {
    if (
      keyDate === inpArray[midIndex]?.date ||
      (keyDate <= inpArray[midIndex]?.date + candleLockerWidthDate / 2 &&
        keyDate >= inpArray[midIndex]?.date - candleLockerWidthDate / 2)
    )
      return midIndex;

    if (lowIndex >= highIndex) {
      return -1;
    } else if (keyDate > inpArray[midIndex]?.date + candleLockerWidthDate / 2) {
      lowIndex = midIndex + 1;
      midIndex = Math.floor((highIndex + lowIndex) / 2);
    } else if (keyDate < inpArray[midIndex]?.date - candleLockerWidthDate / 2) {
      highIndex = midIndex - 1;
      midIndex = Math.floor((highIndex + lowIndex) / 2);
    }
  }
};
