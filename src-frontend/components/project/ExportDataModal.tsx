import { Box, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { FormSubmitBar } from "../SubmitBar";
import { useState } from "react";

type Options = "all-data" | "selected-filters";

export const ExportDataModal = () => {
  const [selectedOption, setSelectedOption] = useState<Options>("all-data");

  const handleChange = (value: Options) => setSelectedOption(value);

  return (
    <Box>
      <RadioGroup onChange={handleChange} value={selectedOption}>
        <Stack>
          <Radio value="all-data">Export all available data</Radio>
          <Radio value="selected-filters">
            Export data with the currently selected filters
          </Radio>
        </Stack>
      </RadioGroup>
      <FormSubmitBar style={{ marginTop: "16px" }} />
    </Box>
  );
};
