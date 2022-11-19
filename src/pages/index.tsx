import {
  Box,
  Button,
  Card,
  CardBody, CardHeader, Heading, SimpleGrid, Text, VStack
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Buyer } from "../components/Buyer";
import { Vendor } from "../components/Vendor";
import { useFirebase } from "../context/context";
import Image from 'next/image'
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Index: React.FC<{}> = ({}) => {
  const { useAuth, signIn, gSignOut, setUser, getUser, addItems } =
    useFirebase();

  const { isSigned, user, pending } = useAuth();
  // console.log(isSigned, user, pending);
  const [loading, setLoading] = useState(true);
  const [occupation, setOccupation] = useState("");
  useEffect(() => {
    setLoading(false);
  }, [isSigned]);

  let body = null;
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
      <VStack h={"100vh"} justifyContent={'center'}>
        To Start Sign in
        <Button onClick={signIn}>Sign In</Button>
      </VStack>
    );
  }
  if (isSigned && occupation === "") {
    body = (
      <Box ml={'auto'} mr={'auto'} mt={"10%"}>

      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        mt={'10%'}
        // ml={'auto'}
        >
        <Card
          as="button"
          align={"center"}
          onClick={async () => {
            await setUser("vendor");
            window.location.reload();
          }}
          bgColor={"beige"}
          boxShadow={"lg"}
        >
          <CardHeader>
            <Heading size="md" mb={2}>Vendor</Heading>
            <Image src="/vendor.jpg" alt="vendor" quality={60} width={300} height={160}/>
          </CardHeader>
          <CardBody mt={-4}>
            <Text>
              Have some items to sell? Sign up as a vendor and start selling
            </Text>
          </CardBody>
        </Card>
        <Card
          as="button"
          align={"center"}
          onClick={async () => {
            await setUser("buyer");
            window.location.reload();
          }}
          bgColor={"beige"}
          boxShadow={"lg"}
          >
          <CardHeader>
            <Heading size="md">Buyer</Heading>
          <Image src="/buyer.jpg" alt="buyer" quality={60} width={300} height={120}/>
          </CardHeader>
          <CardBody mt={-4}>
            <Text>
              Want fresh goods at your doorstep? Sign up as a buyer
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
    );
  } else {
    if (occupation === "vendor") {
      body = <Buyer />;
    } else if (occupation === "buyer") {
      body = <Vendor />;
    }
  }

  return (
    <Box minH={"100vh"} display={'flex'} flexDirection={"column"} alignItems={'center'} bgColor={"white"}>
      {/* <Button onClick={gSignOut}>Sign out</Button> */}
      {body}
      {/* <Buyer /> */}
    </Box>
  );
};

export default Index;
