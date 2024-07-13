import { useRouter } from 'next/router';
import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useContext } from 'react';
import UserContext from '@/contexts/UserContext';
import getConfig from 'next/config';
import { useEffect, useState, useRef } from 'react';
import { Text, Heading, Box, Flex, Image, Button, Fade, ScaleFade, Slide, SlideFade  } from '@chakra-ui/react'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import { keyframes } from '@chakra-ui/react';
import ServerError from '@/components/main/ServerError';
import getCsrfToken from '@/helpers/getCsrfToken';
import isAuthenticated from '@/helpers/auth/isAuthenticated';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import Overlay from '@/components/sub/Overlay';
import ReVerifyEmailPopup from '@/components/sub/ReVerifyEmailPopup';


export default function Home({userData, serverFailure = false}) {

  const router = useRouter();

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL } = publicRuntimeConfig;  

  const {user, setUser} = useContext(UserContext);  

  const [verifiedEmail, setVerifiedEmail] = useState(true);
  const [serverError, setServerError] = useState(serverFailure);  
  const [overlay, setOverlay] = useState(false);  
  const [csrfToken, setCsrfToken] = useState('');    

  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");  
  const [resendLoading, setResendLoading] = useState(false);  
  const [resendVerificationLinkResponse, setResendVerificationLinkResponse] = useState(null);  

  const {colorMode, toggleColorMode} = useColorMode();

  const {light, dark} = colorScheme;
  const {maxContentWidth, mobileBreakPoint} = responsiveConfig;  
    
  const primaryColor = useColorModeValue(light.primary, dark.primary);
  const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
  const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
  const secondaryColor = useColorModeValue(light.secondary, dark.secondary);  

  const [width, setWidth] = useState();

  const updateDimension = () => {
    if (typeof window !== "undefined"){
        setWidth(window.innerWidth);
    }
  }

  const navigate = (destination) => {
    router.push(destination);
  }

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
  
    updateDimension();
    window.addEventListener("resize", updateDimension);       
    router.replace('/');
    return () => {
        window.removeEventListener("resize", updateDimension);               
    }
  }, []);  



  return (
      serverFailure 
        ? <ServerError/>
        : 
        <>
          <Flex 
          flexDirection='column' 
          py='6px' 
          mx='auto'
          my='0'
          maxWidth={maxContentWidth}
          >

          {!verifiedEmail && <ReVerifyEmailPopup resendEmailVerificationLink={resendEmailVerificationLink} emailVerificationResendMessage={emailVerificationMessage} resendLoading={resendLoading} responseType={resendVerificationLinkResponse}/>}
          {overlay && <Overlay/>}

          <Flex width='100%' 
                height="700px" 
                position='relative' 
                justifyContent='space-between' 
                alignItems='center'
                >
              <Flex flexDirection={'column'} width='100%' height='100%' mt={width > 1089 ? '300px' : '200px'} justifyContent={'flex-start'} alignItems={width > 768 ? 'flex-start' : 'center'}  px={width > 468 ? '100px' : '20px'}>
                  <Heading fontSize='50px' lineHeight='60px' textAlign={width <= 768 && 'center'} >Best Chess Site Hands Down.</Heading>
                  <Text textAlign={width <= 768 && 'center'} mt='10px'>Play against folks around the world, anytime, anywhere.</Text>
                  <Flex mt='10px' w='90%' justifyContent='flex-start' alignItems={width <= 768 && 'center'} gap='1rem' flexDirection={width > 1189 ? 'row' : 'column'}>
                      <Button onClick={()=>navigate('/play')} height='50px' width={width > 1189 ? '45%' : '90%'} bg='none' border={`1px solid ${secondaryColor}`} color={secondaryColor} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>Play Online</Button>
                      <Button onClick={()=>navigate('/play/computer')} height='50px' width={width > 1189 ? '45%' : '90%'} bg='none' border={`1px solid ${secondaryColor}`} color={secondaryColor} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>Play Computer</Button>                    
                  </Flex>
              </Flex>
              <Image
                height={width > 1089 ? '100%' : '80%'}
                width={width > 1089 ? '90%' : '50%'}
                minWidth='650px'
                src='/images/landing-image-1.png'
                position={width <= 768 && 'absolute'}
                zIndex={width > 768 ? '1' : '-1'}              
                opacity={width > 768 ? '1' : '0.3'}
                left={0}                       
                right={0}
                top={width <= 768 && '0px'}
                mx='auto'
                my='0'
              />
          </Flex>
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