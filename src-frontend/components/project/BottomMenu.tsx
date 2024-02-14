import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { useLayoutContext } from "../../context/layout";
import { useEffect } from "react";
import { useProjectContext } from "../../context/project";
import { IoMdAdd } from "react-icons/io";
import { BUTTON_VARIANTS } from "../../theme";
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

const HEIGHT = 55;

export const BottomMenu = () => {
  const { setBottomMenuHeight } = useLayoutContext();
  const { projectQuery, selectedFile, selectDatafile } = useProjectContext();

  useEffect(() => {
    setBottomMenuHeight(HEIGHT);
  }, []);

  if (!projectQuery.data || projectQuery.data.datafiles.length === 0) {
    return <Box height={HEIGHT}></Box>;
  }
  return (
    <Box height={HEIGHT} display={"flex"} alignItems={"center"}>
      <Tooltip label="Create a new file">
        <IconButton
          icon={<IoMdAdd />}
          aria-label="add-icon"
          variant={BUTTON_VARIANTS.noFillDefaultColor}
        />
      </Tooltip>
      <Tooltip label="All files">
        <IconButton
          icon={<GiHamburgerMenu />}
          aria-label="add-icon"
          variant={BUTTON_VARIANTS.noFillDefaultColor}
        />
      </Tooltip>

      <Swiper
        direction="horizontal"
        spaceBetween={"16px"}
        slidesPerView={6}
        scrollbar={{ draggable: true }}
        modules={[Scrollbar]}
        style={{ marginTop: "10px" }}
      >
        {projectQuery.data.datafiles.map((item, idx) => {
          return (
            <SwiperSlide>
              <Box
                key={idx}
                width={"200px"}
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
