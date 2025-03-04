import { Spinner as ChakraUISpinner } from "@chakra-ui/react";

const Spinner = ({ ...props }) => {
  return (
    <ChakraUISpinner
      colorScheme={"teal"}
      position={"absolute"}
      top="50%"
      left="50%"
      transform="translate(-50%,-50%)"
      size="xl"
      {...props}
    />
  );
};

export default Spinner;
