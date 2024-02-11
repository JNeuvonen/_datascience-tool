import { Box } from "@chakra-ui/react";
import { useProjectContext } from "../context/project";
import { BasicTable } from "./UnstyledTable";
import { formatBytes } from "../utils/number";

interface SelectFilesDrawerProps {
  onClose: () => void;
}

const COLUMNS = ["File", "Size"];

export const ImportedFilesDrawer = (props: SelectFilesDrawerProps) => {
  const { onClose } = props;
  const { projectQuery } = useProjectContext();

  if (!projectQuery.data) {
    return null;
  }

  return (
    <Box>
      <BasicTable
        columns={COLUMNS}
        rows={projectQuery.data.datafiles.map((item) => {
          return [item.file_name, formatBytes(item.size_bytes)];
        })}
      />
    </Box>
  );
};
