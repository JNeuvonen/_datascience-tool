import { Box, Heading, Progress, Spinner, Stack } from "@chakra-ui/react";
import { COLOR_BG_PRIMARY } from "../styles/colors";

interface Props {
  text: string;
  shouldBeVisible: boolean;
  loadingScreenProgress: number;
}

export const UploadScreen = (props: Props) => {
  const { text, shouldBeVisible, loadingScreenProgress } = props;
  if (!shouldBeVisible) return null;

  return (
    <Box
      width={"100vw"}
      height="100vh"
      position={"fixed"}
      bottom={0}
      top={0}
      left={0}
      right={0}
      zIndex={5}
      background={COLOR_BG_PRIMARY}
    >
      <Stack
        direction={"row"}
        maxWidth={"500px"}
        margin={"0 auto"}
        marginTop={"35vh"}
        gap={"32px"}
      >
        <Spinner />
        <Heading size={"md"}>{text}</Heading>
      </Stack>

      <Box maxWidth={"500px"} margin={"0 auto"} marginTop={"36px"}>
        <Progress hasStripe value={loadingScreenProgress} />
      </Box>
    </Box>
  );
};
