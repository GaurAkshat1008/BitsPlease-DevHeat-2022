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
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/context";
import NavBar from "./NavBar";
import { Formik, Field } from "formik";

interface BuyerProps {}

export const Buyer: React.FC<BuyerProps> = ({}) => {
  const { getItems, addToCart } = useFirebase();

  const [items, setItems] = useState([]);

  const [location, setLocation] = useState("");

  const callItems = async () => {
    const res = await getItems(location);
    setItems(res);
  };

  useEffect(() => {
    const loc = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=8f862fb506bd41e0a1de7779ca4d7cae`;
        const res = await axios.get(url);
        setLocation(res.data.results[0].components.city);
      });
    };
    // loc();
  }, []);
  // callItems();
  // console.log(location);
  // console.log(items);

  return (
    <>
      <NavBar varient={"buyer"} />
      <Formik
        initialValues={{
          location: "",
        }}
        onSubmit={(values) => {
          const locstr =
            values.location.charAt(0).toUpperCase() +
            values.location.slice(1).toLowerCase();

          setLocation(locstr);
          callItems();
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <Flex p={12}>
              <Flex flex={0.8} p={1}>
                <FormControl>
                  {/* <FormLabel htmlFor="location">Type your city name</FormLabel> */}
                  <Field
                    as={Input}
                    id="location"
                    name="location"
                    type="text"
                    variant="filled"
                    placeholder="Type your city name"
                  />
                </FormControl>
              </Flex>
              <Flex flex={0.2} p={1}>
                <Button type="submit" colorScheme="purple" width="full">
                  Search
                </Button>
              </Flex>
            </Flex>
          </form>
        )}
      </Formik>
      <Box p={4}>
        <Code>Showing results for {location}</Code>
      </Box>
      <Stack>
        <SimpleGrid
          p={12}
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          spacing={4}
        >
          {items.map((item) => (
            <Card maxW="sm">
              <CardBody>
                {/* <Image
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            /> */}
                <Stack mt="6" spacing="3">
                  <Heading size="md">{item.name}</Heading>
                  <Text>{item.location}</Text>
                  <Text color="blue.600" fontSize="2xl">
                    {item.price}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button variant="outline" colorScheme="blue" onClick={addToCart(item.id)}>
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};
