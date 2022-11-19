import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from '@chakra-ui/icons';
import { Stack, SimpleGrid, Card, CardBody, Flex, Heading, Stat, StatLabel, StatNumber, Divider, CardFooter, ButtonGroup, IconButton, Button, Text, Icon } from '@chakra-ui/react';
import React, {useEffect} from 'react'
import NavBar from '../components/NavBar';
import { useFirebase } from '../context/context';
import Image from 'next/image';

interface itemsProps {

}

const items: React.FC<itemsProps> = ({}) => {
  const {getSelfItems, useAuth} = useFirebase()
  const [items, setItems] = React.useState([])
  const selfItems = async () => {
    const data = await getSelfItems()
    // console.log(data[0])
    data.map((da) => {
      setItems((items) => [...items, da])
    })
  }
  console.log(items)
  const {isSigned, user, pending} = useAuth()

  useEffect(() => {
    if(!pending){
      selfItems()
    }
  }, [user])

    return (
      <>
      <NavBar varient='vendor'/>
      <Stack h={"100%"} p={12}>
        <SimpleGrid
          p={12}
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          spacing={4}
        >
          {items.length !== 0 ? (
            items.map((item, i) => {
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
                      <IconButton icon={<EditIcon />} aria-label=""/>
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
        </Stack>
      </>
    );
}
export default items