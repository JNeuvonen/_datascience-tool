import { Box, Divider, Heading, Stack, Tabs } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { UnexpectedErrorPage } from "../../components/GenericErrorPage";
import { Breadcrumbs } from "../../components/BreadCrumbs";
import { PATHS } from "../../utils/path";
import { ProjectInfoPage } from "./info";
import { ProjectDatasetsPage } from "./datasets";
import { ChakraTabs } from "../../components/Tabs";

const TAB_LABELS = ["Info", "Datasets"];
const TABS = [<ProjectInfoPage key={0} />, <ProjectDatasetsPage key={1} />];

export const ProjectIndexPage = () => {
  const { project } = useParams();

  if (!project) {
    return <UnexpectedErrorPage />;
  }

  return (
    <Box width={"85%"} margin={"0 auto"}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Breadcrumbs
          items={[
            { label: "Project", href: "/" },
            { label: project, href: PATHS.project(project) },
          ]}
        />
      </Stack>
      <Divider style={{ marginTop: "8px" }} />

      <ChakraTabs
        labels={TAB_LABELS}
        tabs={TABS}
        style={{ marginTop: "8px" }}
      />
    </Box>
  );
};
