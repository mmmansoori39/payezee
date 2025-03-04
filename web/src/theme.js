import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        colorScheme: "teal"
      }
    },
    Checkbox: {
      defaultProps: {
        colorScheme: "teal"
      }
    },
    Spinner: {
      defaultProps: {
        colorScheme: "teal"
      }
    }
  }
});

export default theme;
