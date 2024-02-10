import React, { CSSProperties, useEffect, useState } from "react";
import { TabList, Tab, Tabs, TabPanels, TabPanel } from "@chakra-ui/react";

interface Props {
  labels: string[];
  tabs: React.ReactNode[];
  style?: CSSProperties;
  defaultTab?: number;
}

export const ChakraTabs = ({
  labels,
  tabs,
  style = {},
  defaultTab = 0,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultTab);

  useEffect(() => {
    setSelectedIndex(defaultTab);
  }, [defaultTab]);

  return (
    <Tabs style={style} index={selectedIndex}>
      <TabList style={{ width: "max-content" }}>
        {labels.map((label, index) => (
          <Tab key={index}>{label}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map((tabContent, index) => (
          <TabPanel key={index} hidden={index !== selectedIndex}>
            {index === selectedIndex && tabContent}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
