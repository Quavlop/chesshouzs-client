import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Button, Text, Heading, Box, Flex,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Image  
} from '@chakra-ui/react'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import { useContext } from 'react';
import { useEffect, useState, useRef } from 'react';
import UserContext from '@/contexts/UserContext';
import getConfig from 'next/config';
import ServerError from '@/components/main/ServerError';
import getCsrfToken from '@/helpers/getCsrfToken';
import isAuthenticated from '@/helpers/auth/isAuthenticated';
import Overlay from '@/components/sub/Overlay';
import ReVerifyEmailPopup from '@/components/sub/ReVerifyEmailPopup';

export default function Play({userData, serverFailure = false}) {

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, MIDTRANS_CLIENT_KEY, MIDTRANS_INTERFACE_URL } = publicRuntimeConfig;  

  const {colorMode, toggleColorMode} = useColorMode();

  const {light, dark} = colorScheme;
  const {maxContentWidth, mobileBreakPoint} = responsiveConfig;  
    
  const primaryColor = useColorModeValue(light.primary, dark.primary);
  const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
  const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
  const secondaryColor = useColorModeValue(light.secondary, dark.secondary);  
  const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover);
  
  const {user, setUser} = useContext(UserContext);  

  const [verifiedEmail, setVerifiedEmail] = useState(true);  
  const [serverError, setServerError] = useState(serverFailure);    
  const [overlay, setOverlay] = useState(false);    
  const [csrfToken, setCsrfToken] = useState('');  
  const [flag, setFlag] = useState(false);

  const [transactionToken, setTransactionToken] = useState('');

  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");  
  const [resendLoading, setResendLoading] = useState(false);  
  const [resendVerificationLinkResponse, setResendVerificationLinkResponse] = useState(null);    

  const resendEmailVerificationLink = async (e) => {
    e.preventDefault();
    setResendLoading(true);

    try {
      const response = await fetch(API_URL + '/auth/verify-email/resend', {
        method : "POST",
        headers : {
          'Content-Type' : 'application/json',
          'X-CSRF-Token' : csrfToken,          
        },
        credentials : 'include',
      })

      const data = await response.json();
      setResendLoading(false);
      
      if (data.code === 200){
        setResendVerificationLinkResponse(200);
        setEmailVerificationMessage("Email successfully sent! Check your email account.");        
        return;
      }

      if (data.code === 401){
        setResendVerificationLinkResponse(401);
        setEmailVerificationMessage("Your session has expired. Please try logging in again.");
        return;
      }

      if (data.code === 500){
        setResendVerificationLinkResponse(401);        
        setEmailVerificationPopup(false);
        setOverlay(false);
        setLoading(false);
        setResendLoading(false);
        // setServerError(true);
        return;          
      }


    } catch (err) {
      setResendVerificationLinkResponse(401);      
      setServerError(true);
      return;      
    } 
  }  

    const checkOut = async () => {

      const response = await fetch(API_URL + '/subscription/checkout', 
      {
        method : 'POST',
        headers : {
          'X-CSRF-Token' : csrfToken
        },
        credentials : 'include',
      }
    );      

    const parsedResponse = await response.json();
    if (parsedResponse.code == 200){
      setTransactionToken(parsedResponse.token);
      window.snap.pay(parsedResponse.token);       
    }
  }

  // useEffect(() => {

  //   if (!flag) {
  //     setFlag(true);
  //     return;
  //   }


  //   // const script = document.createElement('script');
  //   // script.id = 'midtrans';
  //   // script.type = 'text/javascript';
  //   // script.src = MIDTRANS_INTERFACE_URL;
  //   // script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
  //   // script.setAttribute('token', transactionToken);
   
    
  //   script.onload = () => {
  //     if (typeof window !== 'undefined' && window.snap) {
  //       window.snap.pay(MIDTRANS_CLIENT_KEY);
  //     }
  //   };

  //   document.body.appendChild(script);     

  // }, [transactionToken]);


  useEffect(() => {
    if (serverFailure) return;


    
    try {
      const setCSRFToken = async () => {
        const token = await getCsrfToken(API_URL);
        setCsrfToken(token);
      }
      setCSRFToken();
    } catch (err) {
      setServerError(true);
      return;     
    }

    if (userData){
      if (!userData.email_verified_at){
        setVerifiedEmail(false);
        setOverlay(true);      
      }    
      setUser(userData);
    }
  }, []);

  return (
    serverFailure 
      ? <ServerError/>
      : 
        <>

          {!verifiedEmail && <ReVerifyEmailPopup resendEmailVerificationLink={resendEmailVerificationLink} emailVerificationResendMessage={emailVerificationMessage} resendLoading={resendLoading} responseType={resendVerificationLinkResponse}/>}
          {overlay && <Overlay/>}

          <Head>
            <script
              src={MIDTRANS_INTERFACE_URL}
              type="text/javascript"
              data-client-key={MIDTRANS_CLIENT_KEY}
              token={transactionToken}
              async
            />
          </Head>      


          <Flex
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          h='80vh'
          w={{sm : '100%', md :'30rem'}}
          m='auto'
          >

            <Image w='auto' h='60px' src='/logo/logo.png'  alt='chesshouzs'/>

            <Heading mb='1rem' color={secondaryColor}>Get Premium</Heading>

            <UnorderedList mb='1rem' px='1rem'>
              <ListItem>Gak dapet apa-apa...</ListItem>
              <ListItem>Cuma buat test payment gateway aja bosq...</ListItem>
              <ListItem>Tapi beli aja ya.. itung-itung donasi :*</ListItem>
            </UnorderedList>            

            <Button onClick={checkOut} 
                    height='50px' 
                    bg={secondaryColor} 
                    color={'white'} 
                    w='80%'
                    _hover={{
                bg : secondaryHover
            }}>Purchase Now</Button>           
          </Flex>

        </>
  )
}

export async function getServerSideProps(context){
  const { req, res } = context;

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, ENVIRONMENT } = publicRuntimeConfig;     


  try {
      const response = await isAuthenticated(API_URL, req.cookies?.__SESS_TOKEN);

      if (response.code == 200){
        return {
          props : {
            serverFailure : false, 
            userData : response.user
          }
        }
      }

      return { props : {serverFailure : false} }      

  } catch (err) {
      return { props : {serverFailure : true} }
  }

}