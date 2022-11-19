import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Code,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/context";
import NavBar from "./NavBar";
import { Formik, Field } from "formik";
import Image from "next/image";
import TimeAgo from 'react-timeago'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

interface BuyerProps {}

export const Buyer: React.FC<BuyerProps> = ({}) => {
  const formatter = buildFormatter(englishStrings)

  const { getItems, addToCart } = useFirebase();

  const [items, setItems] = useState([]);

  const [location, setLocation] = useState("");
  const date = new Date();
  console.log(date);
  const callItems = async () => {
    const res = await getItems(location);
    setItems(res);
  };
  console.log(items);
  useEffect(() => {
    const loc = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=8f862fb506bd41e0a1de7779ca4d7cae`;
        console.log(url);
        const res = await axios.get(url);
        console.log(
          position.coords.latitude,
          position.coords.longitude,
          res.data.results[0].components.city
        );
        setLocation(res.data.results[0].components.city);
      });
    };
    loc();
  }, []);
  useEffect(() => {
    if(location !== undefined){
      callItems();
    }
  }, [location]);
  console.log(location);
  // console.log(items);

  return (
    <Flex direction={"column"} w={"100%"}>
      <NavBar varient={"buyer"} />
      <Box mt={12}>
        <Formik
          initialValues={{
            location: "",
          }}
          onSubmit={async (values) => {
            const locstr =
              values.location.charAt(0).toUpperCase() +
              values.location.slice(1).toLowerCase();
            setLocation(locstr);
            callItems();
            // values.location = "";
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <Flex p={12}>
                <Flex flex={0.8} p={1}>
                  <FormControl>
                    <Field
                      as={Input}
                      id="location"
                      name="location"
                      type="text"
                      variant="outline"
                      placeholder="Type your city name"
                      color={"white"}
                    />
                  </FormControl>
                </Flex>
                <Flex flex={0.2} p={1}>
                  <Button
                    type="submit"
                    colorScheme="purple"
                    bgColor={"#55a6af"}
                    width="full"
                  >
                    Search
                  </Button>
                </Flex>
              </Flex>
            </form>
          )}
        </Formik>
      </Box>
      <Box p={4}>
        <Code>Showing results for {location}</Code>
      </Box>
      <Stack h={"100%"}>
        <SimpleGrid
          p={12}
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          spacing={4}
        >
          {items.length!==0 ? items.map((item) => (
            <Card maxW="sm" border={"2px solid #55a6af"}>
              <CardBody>
                <Flex flex={0.4}>
                <Image src={item.URLS[0]} alt="" layout="intrinsic" width={300} height={300} />
                </Flex>
                <Stack mt="6" spacing="3">
                  <Heading size="md">{item.name}</Heading>
                  <Text>by {item.vendor}</Text>
                  <Text color="blue.600" fontSize="2xl">
                    <Stat color={"#55a6af"}>
                      <StatLabel>Price</StatLabel>
                      <StatNumber  fontWeight={'700'}>₹{item.price}/Kg ({item.quantity}Kg)</StatNumber>
                      <StatHelpText> <TimeAgo date={item.dateStr} formatter={formatter}/> </StatHelpText>
                    </Stat>
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button
                    variant="solid"
                    colorScheme="teal"
                    onClick={() => {
                      addToCart(item.id);
                    }}
                  >
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          )) : <Flex align={'center'} justifyContent={'center'} w={'90vw'}>
              <Image src="/sorry.svg" height={100} width={500} alt=""/>
            </Flex>}
        </SimpleGrid>
      </Stack>
    </Flex>
  );
};
