import React, { CSSProperties } from "react";
import { Card, CardBody, CardHeader } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  heading?: React.ReactNode;
  style?: CSSProperties;
}
export const ChakraCard = ({ children, heading, style }: Props) => {
  return (
    <Card style={style}>
      {heading && <CardHeader>{heading}</CardHeader>}
      <CardBody>{children}</CardBody>
    </Card>
  );
};
