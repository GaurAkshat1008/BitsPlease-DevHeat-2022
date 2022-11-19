import { Box, Container, keyframes, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";

const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 20%; }
  25% { transform: scale(2) rotate(0); border-radius: 20%; }
  50% { transform: scale(2) rotate(270deg); border-radius: 50%; }
  75% { transform: scale(1) rotate(270deg); border-radius: 50%; }
  100% { transform: scale(1) rotate(0); border-radius: 20%; }
`;

const animation = `${animationKeyframes} 4s ease-in-out`;

const Loader = () => {
  const { colorMode } = useColorMode();
  return (
    <Container
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems={"center"}
    >
      <Box
        as={motion.div}
        animation={animation}
        padding="2"
        width="12"
        height="12"
        display="flex"
        boxShadow={ "inset 0 0 50px #fff, inset 20px 0 80px #f0f, inset -20px 0 80px #0ff, inset 20px 0 300px #f0f, inset -20px 0 300px #0ff, 0 0 50px #fff, -10px 0 80px #f0f, 10px 0 80px #0ff;" }
      />
    </Container>
  );
};

export default Loader