import { Heading } from "@chakra-ui/layout";
import { Box, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const UNNAMED_PROJECT_PLACEHOLDER = "Unnamed project";

export const IndexPage = () => {
  const navigate = useNavigate();
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
    </Box>
  );
};
