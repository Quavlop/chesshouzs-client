import Head from 'next/head'
import getConfig from 'next/config';
import { Redirect } from 'react-router-dom';
import { Cookie, Inter } from '@next/font/google'
import { setCookie } from 'cookies-next';
import Cookies from 'js-cookie';
import  jwt  from 'jsonwebtoken';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css'
import { Text, Heading, Container, Flex, Box, Image } from '@chakra-ui/react'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import ServerError from '@/components/main/ServerError';
import getCsrfToken from '@/helpers/getCsrfToken';
import redirectIfAuthenticated from '@/helpers/auth/redirectIfAuthenticated';
import UserContext from '@/contexts/UserContext';
import GoogleButton from '@/components/sub/GoogleButton';
import Overlay from '@/components/sub/Overlay';
import OAuthNotification from '@/components/sub/OAuthNotification';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button
  } from '@chakra-ui/react'

export default function Login({serverFailure = false}) {

  const {user, setUser} = useContext(UserContext);  

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, ENVIRONMENT, GOOGLE_OAUTH_URL } = publicRuntimeConfig;

  const [serverError, setServerError] = useState(serverFailure);
  const [csrfToken, setCsrfToken] = useState('');

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [overlay, setOverlay] = useState(false);
  const [OAuthNotificationMessage, setOAuthNotificationMessage] = useState("");
  const [OAuthPopupNotification, setOAuthPopupNotification] = useState(false);

  const {colorMode, toggleColorMode} = useColorMode();
  const router = useRouter();
  const { err_code } = router.query;
  const {light, dark} = colorScheme;  

  const primaryColor = useColorModeValue(light.primary, dark.primary);
  const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
  const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
  const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
  const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover);     

  const submitLogin = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch(API_URL + '/auth/login', 
        {
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json',
            'X-CSRF-Token' : csrfToken
          },
          credentials : 'include',
          body : JSON.stringify({credential, password})
        }
      );
      const data = await response.json();
 
      if (data.code === 200 && data.token){
        setUser(data.data); 
        router.push('/');
        return;
      }
  
      if (data.code === 401){
        setError(data?.message);
        return;
      }
  
      if (data.code === 500){
        setServerError(true);
        return;
      }    
    } catch (err) {
      console.error(err);
      setServerError(true);
      return;      
    }
  }

  const closeOAuthPopup = () => {setOverlay(false)};


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

  }, []);


  useEffect(() => {
    if (!err_code) return;

    if (err_code == 'AUTH401'){
      setOAuthNotificationMessage("Failed to authenticate.");      
      setOverlay(true);
      return;
    } 

    if (err_code == 'AUTH409'){
      setOAuthNotificationMessage("Your email has been registered.");      
      setOverlay(true);
      return;
    }

  }, [err_code]);


  return (
    serverError ? <ServerError/> : 
    ( 
      <>
        {overlay && 
          <>  
            <Overlay/>
            <OAuthNotification message={OAuthNotificationMessage} handleClose={closeOAuthPopup}/>
          </>
        }
        <Box bg={secondaryColor} w='100%' h='100vh' display='flex' justifyContent='center' alignItems={'center'}>
          <Flex 
            className={styles.login_form}
            bg={primaryColor}
            borderRadius='5px'
            boxShadow='0px 0px 5px 0px black'
            h='550px' 
            w='100%'
            maxWidth='400px'
            flexDirection={'column'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            mx='auto'
            my='0'
            px='20px'
            >
    
            <Image src="/logo/logo.png" h="100px" w='auto'></Image>
    
            <form onSubmit={submitLogin} style={{width : '90%', maxWidth : '400px'}}>
              <FormControl>
                  <Text fontWeight={'bold'}>Username / Email Address</Text>
                  <Input type='text' value={credential} onChange={(e) => setCredential(e.target.value)} name='email' border={error != '' ? '2px solid red' : `1px solid ${secondaryColor}`} mb='5px'/>
                  <Text fontSize={'12px'} color='red' mb='10px'>{error}</Text>
    
                  <Text fontWeight={'bold'}>Password</Text>
                  <Input type='password' value={password}  onChange={(e) => setPassword(e.target.value)} name='password' border={error != '' ? '2px solid red' : `1px solid ${secondaryColor}`} mb='5px'/>
                  <Text fontSize={'12px'} color='red' mb='10px'>{error}</Text>

                  <Button w=
                  '100%' mb='20px' bg={secondaryColor} color='white' height='2.5rem' type="submit">Log In</Button>

                  <GoogleButton onClick={() => {router.push(GOOGLE_OAUTH_URL)}}/>
            
              </FormControl>    
            </form>                
          </Flex>
        </Box>
      </>
  
    )   
  ) 
}


export async function getServerSideProps(context){

  const { req, res } = context;

  // const router = useRouter();

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, ENVIRONMENT } = publicRuntimeConfig;    


  try {
    const checkAuth = await redirectIfAuthenticated(API_URL + '/auth/login', "GET", req.headers?.cookie || '');

    const { code } = await checkAuth;  

    if (code !== 200){
      return {
        redirect: {
          permanent: false,
          destination: '/'
        }
      }    
    }

    return {props : {}}    

  } catch (err){
    return { props : {serverFailure : true} }
  }

}


Login.getLayout = (page) => {
    return (
        (page)
    );
}
