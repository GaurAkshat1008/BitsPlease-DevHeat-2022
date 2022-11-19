import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalOverlay, Tooltip, useDisclosure
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { useFirebase } from "../context/context";
import NavBar from "./NavBar";

export const Vendor = ({}) => {
  const { addItems } = useFirebase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <NavBar varient="vendor" />
      <Box color={"white"} mt={24}>
        <Tooltip label={"Add Item"} bg="gray.300" color="black" hasArrow>
          <IconButton
            aria-label="Add Item"
            icon={<AddIcon />}
            onClick={onOpen}
          />
        </Tooltip>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          blockScrollOnMount={true}
          isCentered
          motionPreset="scale"
          size={"xl"}
        >
          <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
          />
          <ModalContent>
            <Formik
              initialValues={{
                location: "",
                vendor: "",
                itemName: "",
                itemPrice: "",
                images: null,
              }}
              onSubmit={(values) => {
                addItems(
                  values.vendor,
                  values.itemName,
                  values.itemPrice,
                  values.location,
                  values.images
                );
                values.location = "";
                values.vendor = "";
                values.itemName = "";
                values.itemPrice = "";
                values.images = null;
                // window.location.reload();
              }}
            >
              {({ handleSubmit, errors, touched, values, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <ModalCloseButton />
                  <Flex p={12} w={'100%'} ml={'auto'} mr={'auto'}>

                  <ModalBody>
                    <Flex p={1} direction={"column"}>
                      <FormControl mb={4}>
                        <Field
                          as={Input}
                          id="vendor"
                          name="vendor"
                          type="text"
                          variant="outline"
                          placeholder="what is your name"
                          color={"white"}
                          required
                        />
                      </FormControl>
                      <FormControl mb={4}>
                        <Field
                          as={Input}
                          id="location"
                          name="location"
                          type="text"
                          variant="outline"
                          placeholder="Type your city name"
                          color={"white"}
                          required
                        />
                      </FormControl>

                      <FormControl mb={4}>
                        <Field
                          as={Input}
                          id="itemName"
                          name="itemName"
                          type="text"
                          variant="outline"
                          placeholder="What do you want to post?"
                          color={"white"}
                          required
                        />
                      </FormControl>
                      <FormControl mb={4}>
                        <Field
                          as={Input}
                          id="itemPrice"
                          name="itemPrice"
                          type="text"
                          variant="outline"
                          placeholder="For how much?"
                          color={"white"}
                          required
                        />
                      </FormControl>
                      <FormControl mb={4}>
                        <Field
                          id="images"
                          name="images"
                          type="file"
                          // multiple
                          value={undefined}
                          onChange={(event) => {
                            setFieldValue("images", event.currentTarget.files);
                          }}
                        />
                      </FormControl>
                    </Flex>
                    <Flex p={1}>
                      <Button
                        type="submit"
                        colorScheme="purple"
                        bgColor={"#55a6af"}
                        width="100"
                      >
                        Add item
                      </Button>
                    </Flex>
                  </ModalBody>
                  </Flex>
                </form>
              )}
            </Formik>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
