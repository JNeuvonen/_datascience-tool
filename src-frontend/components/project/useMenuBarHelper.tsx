import { useProjectContext } from "../../context/project";

export const useMenuBarHelper = () => {
  const { projectQuery } = useProjectContext();

  const mergeDataframesIsDisabled = () => {
    if (!projectQuery.data) return true;

    return projectQuery.data.datafiles.length < 2;
  };

  return { mergeDataframesIsDisabled };
};
