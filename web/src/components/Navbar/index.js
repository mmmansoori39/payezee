import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { setIsLoggedIn } from "../../redux/slices/CommonSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  const onLogout = () => {
    localStorage.removeItem("user-kosmossolution");
    dispatch(setIsLoggedIn({}));
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
          </HStack>
          {user?.picture && (
            <Flex alignItems={"center"}>
              {user.name && (
                <Box color={"black"} fontSize="lg" mr="4">
                  {user.name}
                </Box>
              )}
              <Menu>
                <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                  <Avatar size={"md"} src={user?.picture} />
                </MenuButton>
                <MenuList>
                  {/* <MenuItem>Logout</MenuItem>
                  <MenuItem>Link 2</MenuItem> */}
                  {/* <MenuDivider /> */}
                  <MenuItem onClick={onLogout}>
                    <Flex alignItems="center">
                      <FiLogOut />
                      <Box ml="2">Logout</Box>
                    </Flex>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
}
