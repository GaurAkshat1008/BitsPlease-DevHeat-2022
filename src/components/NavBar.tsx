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
import NextLink from "next/link";
import { useRouter } from "next/router";

type NavBarVar = "buyer" | "vendor";

interface NavBarProps {
  varient: NavBarVar;
}

const NavBar: React.FC<NavBarProps> = ({ varient }) => {
  const router = useRouter();
  const { useAuth, gSignOut } = useFirebase();
  const { isSigned, user, pending } = useAuth();
  // console.log(user);
  return (
    <Flex bgColor={"#0076ff"} w={"100%"} h={"max-content"} p={2} pos={"fixed"} top={0} zIndex={10}>
      <Menu>
        <MenuButton as={Button} rightIcon={<TriangleDownIcon />} ml={"auto"}>
          {auth && auth.currentUser && auth.currentUser.displayName}
        </MenuButton>
        <MenuList>
          {varient === "buyer" && <MenuItem onClick={() => {
            router.push("/cart")
          }}>Cart</MenuItem>}
          {varient === "vendor" && <MenuItem onClick={() => {
            router.push("/orders")
          }}>Orders</MenuItem>}
          {varient === "vendor" && <MenuItem onClick={() => {
            router.push("/items")
          }}>Items</MenuItem>}
          <MenuItem onClick={() => {
            router.push("/profile")
          }}>Profile</MenuItem>
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
