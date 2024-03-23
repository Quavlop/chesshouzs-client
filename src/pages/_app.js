import '@/styles/globals.css'
import {theme, colorScheme} from "@/helpers/theme.ts"
import {ChakraProvider} from '@chakra-ui/react'
import { useState,useContext, useMemo } from 'react';
import UserContext from '@/contexts/UserContext';

import  Navbar from "@/components/main/Navbar";

export default function App({ Component, pageProps }) {

  // const {user , setUser} = useContext(UserContext);

  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({user, setUser}),
    [user]
  );

  if (Component.getLayout){
    return (
      Component.getLayout(
          <ChakraProvider theme={theme}> 
            <UserContext.Provider value={value}>
              <Component {...pageProps} />
            </UserContext.Provider>
          </ChakraProvider>             

      )
   
    )
  }

  return (
      <ChakraProvider theme={theme}>
        <UserContext.Provider value={value}>
          <Navbar/>
          <Component {...pageProps} />
        </UserContext.Provider>
      </ChakraProvider>      
  );
}
