import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue } from "@chakra-ui/react";
import { loginMerchant } from "../../services/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onLoginSubmit = () => {
    setLoading(true);
    loginMerchant(form.email, form.password)
      .then((isAuth) => {
        if (isAuth) {
          navigate("/merchant/transactions");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChange = (name) => (e) => {
    setForm((p) => ({
      ...p,
      [name]: e.target.value
    }));
  };

  return (
    <Flex align={"center"} mt="8" justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={form.email} onChange={onChange("email")} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={form.password} onChange={onChange("password")} />
            </FormControl>
            <Stack spacing={10}>
              <Button
                isLoading={loading}
                onClick={onLoginSubmit}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500"
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
