import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import supabase from "@/supabaseClient";
import { ChakraProvider, Box, GlobalStyle } from "@chakra-ui/react";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <ChakraProvider>
        <Box
          background="blackAlpha.800"
          textColor="whiteAlpha.800"
          minH={"100vh"}
          minW="100vw"
        >
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </SessionContextProvider>
  );
}
function extendTheme(arg0: {
  config: any;
  styles: { global: (props: any) => any };
}) {
  throw new Error("Function not implemented.");
}
