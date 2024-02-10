import { useEffect, useState } from "react";

interface Props {
  text: string;
}

export function SpinnerText(props: Props) {
  const { text } = props;
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {text}
      {".".repeat(dots)}
    </div>
  );
}
