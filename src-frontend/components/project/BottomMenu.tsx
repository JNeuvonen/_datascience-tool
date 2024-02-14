import { Box, IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useLayoutContext } from "../../context/layout";
import { useEffect } from "react";
import { useProjectContext } from "../../context/project";
import { IoMdAdd } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { OverflopTooltip } from "../OverflowTooltip";
import { FaCaretDown } from "react-icons/fa";
import { COLOR_CONTENT_TERTIARY } from "../../styles/colors";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { ChakraPopover } from "../Popover";
import { BUTTON_VARIANTS } from "../../theming";

const HEIGHT = 55;
const SLIDE_WIDTH = 200;

export const BottomMenu = () => {
  const { setBottomMenuHeight } = useLayoutContext();
  const { projectQuery, selectedFile, selectDatafile } = useProjectContext();
  const { width } = useWindowDimensions();
  const selectFilePopover = useDisclosure();

  useEffect(() => {
    setBottomMenuHeight(HEIGHT);
  }, []);

  if (!projectQuery.data || projectQuery.data.datafiles.length === 0) {
    return <Box height={HEIGHT}></Box>;
  }

  const getSlidesCount = () => {
    if (!projectQuery.data) return 0;

    if (SLIDE_WIDTH * projectQuery.data.datafiles.length < width) {
      return projectQuery.data.datafiles.length;
    }
    return Math.floor(width / SLIDE_WIDTH);
  };
  return (
    <Box height={HEIGHT} display={"flex"} alignItems={"center"}>
      <Tooltip label="Create a new file">
        <IconButton
          icon={<IoMdAdd />}
          aria-label="add-icon"
          variant={BUTTON_VARIANTS.noFillDefaultColor}
        />
      </Tooltip>

      <ChakraPopover
        {...selectFilePopover}
        body={
          <Box maxHeight={"300px"} overflowY={"auto"}>
            {projectQuery.data.datafiles.map((item, idx) => {
              return <Box key={idx}>{item.file_name}</Box>;
            })}
          </Box>
        }
        headerText="Select a file"
        setOpen={selectFilePopover.onOpen}
      >
        <Tooltip label="All files">
          <IconButton
            icon={<GiHamburgerMenu />}
            aria-label="add-icon"
            variant={BUTTON_VARIANTS.noFillDefaultColor}
          />
        </Tooltip>
      </ChakraPopover>

      <Swiper
        direction="horizontal"
        spaceBetween={"16px"}
        slidesPerView={getSlidesCount()}
        scrollbar={{ draggable: true }}
        modules={[Scrollbar]}
        style={{ marginTop: "10px" }}
      >
        {projectQuery.data.datafiles.map((item, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Box
                width={SLIDE_WIDTH}
                id={item.file_name}
                display={"flex"}
                alignItems={"center"}
                gap={"8px"}
                _hover={{ bg: COLOR_CONTENT_TERTIARY }}
                padding={"6px"}
                paddingLeft={"14px"}
                paddingRight={"14px"}
                borderRadius={"10px"}
                onClick={() => {
                  selectDatafile(item.file_name as string);
                }}
                cursor={"pointer"}
                background={
                  selectedFile?.file_name === item.file_name
                    ? COLOR_CONTENT_TERTIARY
                    : undefined
                }
              >
                <OverflopTooltip
                  text={item.file_name}
                  containerId={item.file_name}
                >
                  <Box display={"flex"} gap="6px">
                    {item.file_name}
                  </Box>
                </OverflopTooltip>
                <FaCaretDown />
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};
