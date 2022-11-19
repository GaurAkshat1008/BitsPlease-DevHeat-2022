import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { TriangleDownIcon, CloseIcon } from "@chakra-ui/icons";
import { useFirebase } from "../context/context";
import { auth } from "../firebase/firebase";

type NavBarVar = "buyer" | "vendor";

interface NavBarProps {
  varient: NavBarVar;
}

const NavBar: React.FC<NavBarProps> = ({ varient }) => {
  const { useAuth, gSignOut } = useFirebase();
  const { isSigned, user, pending } = useAuth();
  // console.log(user);
  return (
    <Flex bgColor={"red"} w={"100%"} h={"max-content"} p={2}>
      <Menu>
        <MenuButton as={Button} rightIcon={<TriangleDownIcon />} ml={"auto"}>
          {auth && auth.currentUser && auth.currentUser.displayName}
        </MenuButton>
        <MenuList>
          <MenuItem>Cart</MenuItem>
          <MenuItem>Profile</MenuItem>
          <MenuDivider />
          <MenuItem
            onClick={() => {
              gSignOut();
            }}
            alignItems={"center"}
          >
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default NavBar;
