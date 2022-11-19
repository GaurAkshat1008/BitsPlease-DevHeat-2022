import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useFirebase } from "../context/context";
import NavBar from "../components/NavBar";
import { Vendor } from "../components/Vendor";
import { Buyer } from "../components/Buyer";
import { connectStorageEmulator } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const Index: React.FC<{}> = ({}) => {
  const { useAuth, signIn, gSignOut, setUser, getUser, addItems } =
    useFirebase();

  const { isSigned, user, pending } = useAuth();
  // console.log(isSigned, user, pending);
  const [loading, setLoading] = useState(true);
  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);

  let body = null;
  // function add() {
  //   addItems("vendor", "name", "price", "details", "Ahmedabad");
  // }
  // for (var i = 0; i < 10; i++) {
  //   add();
  // }
  if (isSigned) {
    if (auth) {
      const occData = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOccupation(docSnap.data().occupation);
          // console.log(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
      occData();
    }
  }
  // console.log(occupation);
  if (!loading && !isSigned) {
    body = (
      <VStack>
        To Start Sign in
        <Button onClick={signIn}>Sign In</Button>
      </VStack>
    );
  }
  if (isSigned && occupation === "") {
    body = (
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        <Card
          as="button"
          align={"center"}
          onClick={() => {
            setUser("vendor");
            // window.location.reload();
          }}
        >
          <CardHeader>
            <Heading size="md">Vendor</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
        </Card>
        <Card
          as="button"
          align={"center"}
          onClick={() => {
            setUser("buyer");
            // window.location.reload();
          }}
        >
          <CardHeader>
            <Heading size="md">Buyer</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>
    );
  } else {
    if (occupation === "vendor") {
      // console.log("vendor");
      // window.location.reload();
      body = <Vendor />;
    } else if (occupation === "buyer") {
      // window.location.reload();
      // console.log("buyer");
      body = <Buyer />;
    }
  }

  return (
    <Box h={"100%"}>
      {/* <Flex justifyContent={"center"} align={"center"}> */}
      {/* <Button onClick={gSignOut}>Sign out</Button> */}
      {body}
      {/* </Flex> */}
    </Box>
  );
};

export default Index;
