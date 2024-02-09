export const formatToGigaBytes = (sizeBytes: number) => {
  return roundNumberDropRemaining(sizeBytes / 1024 / 1024 / 1024, 2);
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
