import { Box, IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useLayoutContext } from "../../context/layout";
import { useEffect } from "react";
import { useProjectContext } from "../../context/project";
import { IoMdAdd } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { COLOR_BG_SECONDARY } from "../../styles/colors";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { ChakraPopover } from "../Popover";
import { BUTTON_VARIANTS } from "../../theming";
import { IoIosCheckmark } from "react-icons/io";
import { BottomMenuFile } from "./BottomMenuFile";

const HEIGHT = 55;
const SLIDE_WIDTH = 200;

export const BottomMenu = () => {
  const { setBottomMenuHeight } = useLayoutContext();
  const { projectQuery, selectedFile, selectDatafile, setNewDataframeUIMode } =
    useProjectContext();
  const { width } = useWindowDimensions();
  const selectFilePopover = useDisclosure();
  const fileActionsPopover = useDisclosure();

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
      <Tooltip label="Create a new dataframe">
        <IconButton
          icon={<IoMdAdd />}
          aria-label="add-icon"
          variant={BUTTON_VARIANTS.noFillDefaultColor}
          onClick={setNewDataframeUIMode}
        />
      </Tooltip>

      <ChakraPopover
        {...selectFilePopover}
        body={
          <Box maxHeight={"300px"} overflowY={"auto"}>
            {projectQuery.data.datafiles.map((item, idx) => {
              return (
                <Box
                  key={idx}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  _hover={{ bg: COLOR_BG_SECONDARY }}
                  display={"flex"}
                  alignItems={"center"}
                  marginTop={"8px"}
                  paddingTop={"6px"}
                  paddingBottom={"6px"}
                  onClick={() => {
                    selectDatafile(item.file_name as string);
                    selectFilePopover.onClose();
                  }}
                >
                  {selectedFile?.file_name === item.file_name && (
                    <IoIosCheckmark size={25} />
                  )}

                  <Box
                    marginLeft={
                      selectedFile?.file_name !== item.file_name ? "25px" : 0
                    }
                  >
                    {item.file_name}
                  </Box>
                </Box>
              );
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
            <SwiperSlide key={idx} onClick={fileActionsPopover.onOpen}>
              <BottomMenuFile
                datafile={item}
                selectFilePopover={selectFilePopover}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};
