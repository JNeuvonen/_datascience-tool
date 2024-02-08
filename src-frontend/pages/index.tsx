import { Heading } from "@chakra-ui/layout";
import { Box, Button, Stack } from "@chakra-ui/react";

export const IndexPage = () => {
  return (
    <Box maxWidth={"800px"} margin={"0 auto"}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Heading size={"md"}>Previous projects</Heading>

        <Button>+ Add</Button>
      </Stack>
    </Box>
  );
};
