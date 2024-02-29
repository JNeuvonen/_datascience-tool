import {
  Box,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { FormSubmitBar } from "../SubmitBar";
import { useState } from "react";
import { Label } from "../Label";
import { useProjectContext } from "../../context/project";
import { saveDatasetFile } from ".";

type Options = "all-data" | "all-data-with-filters" | "part-of-data";

export const ExportDataModal = () => {
  const [selectedOption, setSelectedOption] = useState<Options>("all-data");
  const [useFilters, setUseFilters] = useState(true);
  const { exportDataModal, selectedFile, gridApi } = useProjectContext();
  const [dataStart, setDataStart] = useState(0);
  const [dataLimit, setDataLimit] = useState(100);

  const handleChange = (value: Options) => setSelectedOption(value);

  const submit = () => {
    const filters = gridApi?.getFilterModel();

    if (!selectedFile) return;

    saveDatasetFile(
      selectedFile.id,
      {
        exportAll: selectedOption === "all-data" ? true : false,
        exportIdxStart: dataStart,
        exportIdxEnd: dataLimit,
      },
      JSON.stringify(filters),
      selectedFile?.file_name
    );
  };

  return (
    <Box>
      <RadioGroup onChange={handleChange} value={selectedOption}>
        <Stack>
          <Radio value="all-data">Export all available data</Radio>
          <Radio value="part-of-data">Export part of the data</Radio>
        </Stack>

        {selectedOption === "part-of-data" && (
          <Box marginTop={"16px"}>
            <Label label={"Data start (index)"}>
              <NumberInput
                value={dataStart}
                min={0}
                step={100}
                onChange={(e) => setDataStart(Number(e))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper color={"white"} />
                  <NumberDecrementStepper color={"white"} />
                </NumberInputStepper>
              </NumberInput>
            </Label>
            <Label
              label={"Number of rows"}
              containerStyles={{ marginTop: "16px" }}
            >
              <NumberInput
                value={dataLimit}
                min={0}
                step={100}
                onChange={(e) => setDataLimit(Number(e))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper color={"white"} />
                  <NumberDecrementStepper color={"white"} />
                </NumberInputStepper>
              </NumberInput>
            </Label>
          </Box>
        )}
      </RadioGroup>

      <Label
        label={"Use current filters"}
        containerStyles={{ marginTop: "16px" }}
      >
        <Switch
          isChecked={useFilters}
          onChange={() => setUseFilters(!useFilters)}
        />
      </Label>
      <FormSubmitBar
        style={{ marginTop: "16px" }}
        submitCallback={submit}
        cancelCallback={exportDataModal.onClose}
      />
    </Box>
  );
};
