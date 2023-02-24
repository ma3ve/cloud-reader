import { Spinner as ChakraSpinner, Stack } from "@chakra-ui/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
  loading: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "xs";
};

function Spinner({ children, size = "lg", loading }: Props) {
  return (
    <Stack position="relative">
      <Stack
        opacity={loading ? "0.2" : 1}
        pointerEvents={loading ? "none" : "all"}
      >
        {children}
      </Stack>
      {loading && (
        <Stack
          transform="translate(-50%, -50%)"
          position={"absolute"}
          left="50%"
          top="50%"
          className="test"
          style={{ marginTop: "0" }}
        >
          <ChakraSpinner size={size} />
        </Stack>
      )}
    </Stack>
  );
}

export default Spinner;
