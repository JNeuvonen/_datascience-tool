import { Heading } from "@chakra-ui/layout";
import { Box, Button, Spinner, Stack, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useProjectsQuery } from "../client/queries";
import { FaGear } from "react-icons/fa6";
import { BasicTable } from "../components/UnstyledTable";
import { formatBytes } from "../utils/number";
import { BUTTON_VARIANTS } from "../theming";

export const UNNAMED_PROJECT_PLACEHOLDER = "Unnamed project";
export const UNNAMED_FILE_PLACEHOLDER = "Unnamed dataframe";

const COLUMNS = ["Name", "Files", "Imported size", ""];

export const IndexPage = () => {
  const navigate = useNavigate();
  const projectsQuery = useProjectsQuery();

  if (!projectsQuery.data) {
    return <Spinner />;
  }
  return (
    <Box maxWidth={"800px"} margin={"0 auto"}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Heading size={"md"}>Previous projects</Heading>

        <Button
          onClick={() => navigate("/project/" + UNNAMED_PROJECT_PLACEHOLDER)}
        >
          + Add
        </Button>
      </Stack>
      <Box marginTop={"16px"}>
        <BasicTable
          columns={COLUMNS}
          rows={projectsQuery.data.map((item) => {
            return [
              item.project.name,
              item.datafiles.length,
              formatBytes(
                item.datafiles.reduce((accumulator, currentValue) => {
                  return accumulator + currentValue.size_bytes;
                }, 0)
              ),
              <IconButton
                icon={<FaGear />}
                variant={BUTTON_VARIANTS.grey}
                aria-label={`setting-button-${item.project.name}`}
              />,
            ];
          })}
          rowOnClickFunc={(item) => {
            navigate("/project/" + item[0]);
          }}
        />
      </Box>
    </Box>
  );
};
