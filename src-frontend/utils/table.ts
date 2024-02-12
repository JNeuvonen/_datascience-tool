export const convertColumnsToAgGridFormat = (
  rows: number[][],
  columns: string[]
) => {
  const ret: { [field: string]: number }[] = [];
  rows.forEach((row) => {
    const item = {} as { [field: string]: number };
    row.forEach((cellValue, i) => {
      item[columns[i]] = cellValue;
    });
    ret.push(item);
  });
  return ret;
};
