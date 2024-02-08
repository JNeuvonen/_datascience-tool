import { ROUTES, ROUTE_KEYS } from "./constants";

export const PATHS = {
  project: (projectName: string) =>
    ROUTES.project.replace(ROUTE_KEYS.project, projectName),
};
