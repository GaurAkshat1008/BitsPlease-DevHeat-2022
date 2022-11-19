import {
  Stack,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import TimeAgo from "javascript-time-ago";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useFirebase } from "../context/context";
import Image from "next/image";
import englishStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

interface cartProps {}

const cart: React.FC<cartProps> = ({}) => {
  const formatter = buildFormatter(englishStrings);
  const { getCartItems, useAuth } = useFirebase();
  const { isSigned, user, pending } = useAuth();
  const [items, setItems] = useState([]);
  const [quant, setQuant] = useState([]);
  const [famt, setFamt] = useState(0);
  const cartItems = async () => {
    const data = await getCartItems();
    // console.log(data);
    data.forEach((da) => {
      setItems((items) => [...items, da]);
      setQuant((quant) => [...quant, 1]);
    });
  };
  useEffect(() => {
    if (!pending) {
      cartItems();
    }
    // setAmt(0);
  }, [user]);

  let amt = 0;
  // setFamt(amt)
  return (
    <>
      <NavBar varient={"buyer"} />
      <Stack h={"100%"} p={12}>
        <SimpleGrid
          p={12}
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          spacing={4}
        >
          {items.length !== 0 ? (
            items.map((item, i) => {
              amt += item.price * quant[i];
              // console.log(amt);
              return (
                <Card maxW="sm" border={"2px solid #55a6af"}>
                  <CardBody>
                    <Flex direction={'column'}>
                      <Flex flex={0.6}>
                        <Image
                          src={item.URLS[0]}
                          alt=""
                          width={400}
                          height={1000}
                        />
                      </Flex>
                      <Flex flex={0.4}>
                        <Stack mt="6" spacing="3">
                          <Heading size="md">{item.name}</Heading>
                          <Text>by {item.vendor}</Text>
                          <Text color="blue.600" fontSize="2xl">
                            <Stat color={"black"}>
                              <StatLabel>Price</StatLabel>
                              <StatNumber>₹{item.price}/Kg</StatNumber>
                            </Stat>
                          </Text>
                        </Stack>
                      </Flex>
                    </Flex>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <ButtonGroup spacing="2">
                      <IconButton
                        icon={<ChevronLeftIcon />}
                        onClick={() => {
                          if (quant[i] > 1) {
                            setQuant((quant) => [
                              ...quant.slice(0, i),
                              quant[i] - 1,
                              ...quant.slice(i + 1),
                            ]);
                            // calcAmt();
                            // console.log(quant)
                            // setAmt(amt + item.price * quant[i]);
                          }
                        }}
                        aria-label=""
                      />
                      <Text as={Button}>{quant[i]}</Text>
                      <IconButton
                        icon={<ChevronRightIcon />}
                        onClick={() => {
                          if (quant[i] < item.quantity) {
                            setQuant((quant) => [
                              ...quant.slice(0, i),
                              quant[i] + 1,
                              ...quant.slice(i + 1),
                            ]);
                            // calcAmt();
                            // console.log(quant)
                            // setAmt(amt + item.price * quant[i]);
                          }
                        }}
                        aria-label=""
                      />
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <Flex align={"center"} justifyContent={"center"} w={"90vw"}>
              <Image src="/sorry.svg" height={100} width={500} alt="" />
            </Flex>
          )}
        </SimpleGrid>
        <Flex>
          <Stat>
            <StatLabel>Total Amount</StatLabel>
            <StatNumber>₹{amt}</StatNumber>
          </Stat>
          <Button>Pay now</Button>
        </Flex>
      </Stack>
    </>
  );
};

export default cart;
