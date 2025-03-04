import { Box } from "@chakra-ui/react";

const Wrapper = ({ children, variant = "regular", ...restProps }) => {
  return (
    <Box maxWidth={variant === "regular" ? "900px" : "500px"} mx="auto" {...restProps}>
      {children}
    </Box>
  );
};

export default Wrapper;
