import { Box } from "@chakra-ui/layout";
import { COLOR_CONTENT_TERTIARY } from "../../styles/colors";
import { DataFile } from "../../client/requests";
import { useProjectContext } from "../../context/project";
import { OverflopTooltip } from "../OverflowTooltip";
import { FaCaretDown } from "react-icons/fa6";

const SLIDE_WIDTH = 200;
interface Props {
  datafile: DataFile;
  selectFilePopover: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isControlled: boolean;
    getButtonProps: (props?: any) => any;
    getDisclosureProps: (props?: any) => any;
  };
}
export const BottomMenuFile = ({ datafile, selectFilePopover }: Props) => {
  const { selectDatafile, selectedFile, setSelectedFileContext } =
    useProjectContext();
  return (
    <Box
      width={SLIDE_WIDTH}
      id={datafile.file_name}
      display={"flex"}
      alignItems={"center"}
      gap={"8px"}
      _hover={{ bg: COLOR_CONTENT_TERTIARY }}
      padding={"6px"}
      paddingLeft={"14px"}
      paddingRight={"14px"}
      borderRadius={"10px"}
      onContextMenu={(e) => {
        e.preventDefault();
        setSelectedFileContext(datafile);
      }}
      onClick={() => {
        selectDatafile(datafile.file_name as string);
        selectFilePopover.onClose();
      }}
      cursor={"pointer"}
      background={
        selectedFile?.id === datafile.id ? COLOR_CONTENT_TERTIARY : undefined
      }
    >
      <OverflopTooltip
        text={datafile.file_name}
        containerId={datafile.file_name}
      >
        <Box display={"flex"} gap="6px">
          {datafile.file_name}
        </Box>
      </OverflopTooltip>
      <FaCaretDown />
    </Box>
  );
};
