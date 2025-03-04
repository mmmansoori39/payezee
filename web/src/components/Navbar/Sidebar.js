import {
  Avatar,
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { FiChevronDown, FiHome, FiMenu } from "react-icons/fi";
import { MdOutlineBusinessCenter, MdPayment } from "react-icons/md";
import { TbCircleKey, TbReport } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { setIsLoggedIn } from "../../redux/slices/CommonSlice";
import { memo } from "react";
import { userTypes } from "../../utils/constants";

const LinkItems = [
  { name: "Home", icon: FiHome, path: "/dashboard", activePaths: [] },
  {
    name: "Merchants",
    icon: MdOutlineBusinessCenter,
    path: "/dashboard/merchant",
    activePaths: ["/dashboard/merchant/:merchantId"]
  },
  { name: "Deposit", icon: MdPayment, path: "/dashboard/transaction/deposit", activePaths: [] },
  { name: "Payout", icon: MdPayment, path: "/dashboard/transaction/payout", activePaths: [] },
  { name: "Generate Signature", icon: TbCircleKey, path: "/generate-signature", activePaths: [] },
  { name: "Generate Report", icon: TbReport, path: "/excel-report", activePaths: [] }
];

export default memo(function SidebarWithHeader({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoggedIn } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  const onLogout = () => {
    localStorage.removeItem("user-kosmossolution");
    dispatch(setIsLoggedIn({}));
  };

  const showSidebar = isLoggedIn && user.type === userTypes.ADMIN;

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      {showSidebar && (
        <>
          <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
          <Drawer
            autoFocus={false}
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="full">
            <DrawerContent>
              <SidebarContent onClose={onClose} />
            </DrawerContent>
          </Drawer>
        </>
      )}
      {/* mobilenav */}
      <MobileNav isLoggedIn={isLoggedIn} isAdmin={showSidebar} user={user} logout={onLogout} onOpen={onOpen} />
      <Box ml={{ base: 0, md: showSidebar ? 60 : 0 }}>{children}</Box>
    </Box>
  );
});

const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <RouterLink to={"/"}>
          <Image height={"50px"} src="/payezee_logo.png" objectFit={"cover"} />
        </RouterLink>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} isActive={location.pathname === link.path} path={link.path} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, isActive, children, ...rest }) => {
  return (
    <RouterLink to={rest.path}>
      <Link href="#" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          {...(isActive
            ? {
                bg: "teal",
                color: "white"
              }
            : {})}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              {...(isActive
                ? {
                    color: "white"
                  }
                : {})}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </RouterLink>
  );
};

const MobileNav = ({ onOpen, user, isAdmin, logout, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: isAdmin ? 60 : 0 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{
        base: "space-between",
        md: isAdmin ? "flex-end" : user?.type === userTypes.MERCHANT ? "space-between" : "flex-start"
      }}
      {...rest}>
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {(!user?.name || user?.type === userTypes.MERCHANT) && (
        <RouterLink to={"/"}>
          <Image height={"50px"} src="/payezee_logo.png" objectFit={"cover"} />
        </RouterLink>
      )}

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          {user?.email && (
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                <HStack>
                  <Avatar size={"sm"} src={user.picture} />
                  <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                    {user.name && <Text fontSize="sm">{user.name}</Text>}
                    <Text fontSize="xs" color="gray.600">
                      {isAdmin ? "Admin" : "Merchant"}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList bg={"white"} borderColor={"gray.200"}>
                {/* <MenuItem>Settings</MenuItem>
                <MenuDivider /> */}
                <MenuItem onClick={logout}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </HStack>
    </Flex>
  );
};
