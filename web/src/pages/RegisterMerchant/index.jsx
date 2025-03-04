import { Box } from "@chakra-ui/react";
import MerchantRegisterForm from "../../components/MerchantRegisterForm";
import Wrapper from "../../components/Wrapper";

const RegisterMerchant = () => {
  return (
    <Wrapper>
      <Box p={{ base: "4", md: "6" }}>
        <MerchantRegisterForm values={{}} />
      </Box>
    </Wrapper>
  );
};
export default RegisterMerchant;
