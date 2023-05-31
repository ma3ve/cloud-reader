import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import supabase from '@/supabaseClient'
import { ChakraProvider, Box, GlobalStyle } from '@chakra-ui/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  return (
    <>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionContextProvider>
      <ToastContainer />
    </>
  )
}
