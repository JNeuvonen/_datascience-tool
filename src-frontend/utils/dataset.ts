import { SqlDtype } from "../client/queries";

export const getAgGridDtype = (sqlDType: SqlDtype) => {
  switch (sqlDType) {
    case "NULL":
      return false;
    case "REAL":
      return "agNumberColumnFilter";
    case "INTEGER":
      return "agNumberColumnFilter";
    case "DATE":
      return "agDateColumnFilter";
    case "TEXT":
      return "agTextColumnFilter";
    case "BLOB":
      return false;
    default:
      return "agTextColumnFilter";
  }
};
