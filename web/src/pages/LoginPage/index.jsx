import { Button, Flex, Heading } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { loginUser } from "../../services/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <Wrapper position="relative" height="calc(100vh - 65px - 65px)">
      <Flex
        position="absolute"
        transform="translateY(-50%)"
        top="50%"
        width="100%"
        alignItems="center"
        flexDirection="column">
          <Heading as={'h2'} fontSize={'2xl'} mb='4' color="teal">Admin Login</Heading>
        <GoogleLogin
          ux_mode="popup"
          width={200}
          // auto_select
          useOneTap
          flow={false}
          onSuccess={(credentialResponse) => {
            if (credentialResponse?.credential) {
              loginUser(credentialResponse?.credential).then((res) => {
                if (res) {
                  navigate("/dashboard");
                }
              });
            }
          }}
          onError={() => {
            // eslint-disable-next-line no-console
            console.log("Login Failed");
          }}
        />
        <Button mt='8' variant={'ghost'} onClick={()=>{
          navigate("/merchant/login");
        }} width={200}>Merchant Login</Button>
      </Flex>
    </Wrapper>
  );
};

export default LoginPage;
