import { Box, Text, useToast } from "@chakra-ui/react";
import { setJoinCol } from "../../client/requests";
import { usePathParams } from "../../hooks/usePathParams";
import { TEXT_VARIANTS } from "../../theming";

interface Props {
  successCallback: () => void;
  onClose: () => void;
  commonColumns: string[];
}

export const SetJoinColModal = (props: Props) => {
  const { onClose, commonColumns } = props;
  const { project } = usePathParams<{ project: string }>();
  const toast = useToast();
  const onSubmit = async (selectedColumn: string) => {
    const res = await setJoinCol(project, selectedColumn);
    if (res.status === 200 || res === "OK") {
      toast({
        title: "Created project",
        position: "bottom-left",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };
  return (
    <Box>
      <Text size={"xs"} variant={TEXT_VARIANTS.plain}>
        All the datasets share a common column that can be used as a join
        column. Join columns are helpful in merging files and aggregating      
          rows.
      </Text>

      <Text size={"xs"} variant={TEXT_VARIANTS.plain} marginTop={"8px"}>
        The following columns can be used as a join column:
      </Text>
      <Box marginTop={"16px"}>
        {commonColumns.map((item, idx) => {
          return (
            <Text
              key={idx}
              variant={TEXT_VARIANTS.clickable}
              onClick={() => onSubmit(item)}
            >
              {item}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
};
