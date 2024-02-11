export const formatToGigaBytes = (sizeBytes: number) => {
  return roundNumberDropRemaining(sizeBytes / 1024 / 1024 / 1024, 2);
};

export type BYTE_SIZE = "GB" | "MB" | "KB";

const SIZE_KB = 1024;
const SIZE_MB = SIZE_KB * 1024;
const SIZE_GB = SIZE_MB * 1024;

export const formatBytes = (sizeBytes: number, appendMagnitude = true) => {
  let formattedSize: string | number;
  let magnitude: string;

  if (sizeBytes >= SIZE_GB) {
    formattedSize = (sizeBytes / SIZE_GB).toFixed(2);
    magnitude = "GB";
  } else if (sizeBytes >= SIZE_MB) {
    formattedSize = (sizeBytes / SIZE_MB).toFixed(2);
    magnitude = "MB";
  } else if (sizeBytes >= SIZE_KB) {
    formattedSize = (sizeBytes / SIZE_KB).toFixed(2);
    magnitude = "KB";
  } else {
    formattedSize = sizeBytes;
    magnitude = "Bytes";
  }

  return appendMagnitude ? `${formattedSize} ${magnitude}` : formattedSize;
};

export const roundNumberDropRemaining = (
  num: number,
  decimalPlaces: number
): number => {
  const factor = Math.pow(10, decimalPlaces);
  const rounded = Math.floor(num * factor) / factor;

  if (rounded === 0 && decimalPlaces < 8) {
    return roundNumberDropRemaining(num, decimalPlaces + 1);
  }

  return rounded;
};
