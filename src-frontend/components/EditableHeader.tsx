import { Box, Heading, Input } from "@chakra-ui/react";
import { CSSProperties, useRef, useState } from "react";

interface Props {
  defaultValue: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  styles?: CSSProperties;
  onInputBlur?: () => void;
}

export const EditableHeader = (props: Props) => {
  const { defaultValue, value, styles, setValue, onInputBlur } = props;
  const ref = useRef<HTMLInputElement>(null);

  const [clicked, setClicked] = useState(false);

  return (
    <Box style={styles}>
      {clicked ? (
        <Input
          variant="unstyled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Project name"
          _placeholder={{ opacity: 1, color: "gray.500" }}
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
              e.preventDefault();
              e.target.blur();
            }
          }}
          onBlur={() => {
            if (onInputBlur) {
              onInputBlur();
            }
            setClicked(false);
          }}
        />
      ) : (
        <Heading onClick={() => setClicked(true)} size={"md"}>
          {defaultValue}
        </Heading>
      )}
    </Box>
  );
};
