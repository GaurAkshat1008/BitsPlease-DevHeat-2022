import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { FunctionProvider } from "../context/context";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

function MyApp({ Component, pageProps }: AppProps) {
  const [showing, setShowing] = useState(false);
  useEffect(() => {
    setShowing(true);
  }, []);
  if (!showing) return (
    null
  );
  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <FunctionProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </FunctionProvider>
    );
  }
}

export default MyApp;
