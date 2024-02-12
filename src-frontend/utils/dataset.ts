import { SqlDtype } from "../client/queries";
import { CategoricalFilter } from "../components/project/CategoricalFilter";

export const getAgGridFilterType = (sqlDType: SqlDtype) => {
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
    case "CATEGORY":
      return CategoricalFilter;
    case "BLOB":
      return false;
    default:
      return "agTextColumnFilter";
  }
};
