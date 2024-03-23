import Head from 'next/head'
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Text, Heading, Container, Flex, Box, Image } from '@chakra-ui/react'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import ServerError from '@/components/main/ServerError';
import getCsrfToken from '@/helpers/getCsrfToken';
import redirectIfAuthenticated from '@/helpers/auth/redirectIfAuthenticated';
import Overlay from '@/components/sub/Overlay';
import Loading from '@/components/sub/Loading';
import EmailVerification from '@/components/sub/EmailVerification';
import UserContext from '@/contexts/UserContext';
import GoogleButton from '@/components/sub/GoogleButton';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button
  } from '@chakra-ui/react'

export default function Register({serverFailure = false}) {

  const {user, setUser} = useContext(UserContext);  

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, GOOGLE_OAUTH_URL } = publicRuntimeConfig;

  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendVerificationLinkResponse, setResendVerificationLinkResponse] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [emailVerificationPopup, setEmailVerificationPopup] = useState(false);
  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");

  const [serverError, setServerError] = useState(serverFailure);    
  const [csrfToken, setCsrfToken] = useState('');  

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const {colorMode, toggleColorMode} = useColorMode();
  const router = useRouter();
  const {light, dark} = colorScheme;  

  const primaryColor = useColorModeValue(light.primary, dark.primary);
  const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
  const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
  const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
  const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover); 

  const submitRegister = async (e) => {
    e.preventDefault();

    setOverlay(true);
    setLoading(true);


    try{
      const response = await fetch(API_URL + "/auth/register",
        {
          method : "POST",
          headers : {
            'Content-Type' : 'application/json',
            'X-CSRF-Token' : csrfToken          
          },
          credentials : 'include',        
          body : JSON.stringify({username, email, password})
        }
      )

      const data = await response.json();

      if (data.code === 200 && data.account){
        setUser(data.account);        
        setEmailVerificationPopup(true);
        setLoading(false);
        return;
      }

      if (data?.code === 400){
        setOverlay(false);
        setLoading(false);

        const {errors = {}}  = data;

        if (!errors?.USERNAME){
          setUsernameError('');
        } else {
          setUsernameError(errors?.USERNAME.message);
        }

        if (!errors?.EMAIL){
          setEmailError('');
        } else {
          setEmailError(errors?.EMAIL.message);          
        }

        if (!errors?.PASSWORD){
          setPasswordError('');
        } else {
          setPasswordError(errors?.PASSWORD.message);             
        }
 

             
      }

      if (data?.code === 500){
          setServerError(true);
          return;
      }

    } catch(err){
      setServerError(true);
      return;           
    }

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

  }, []);  

  return serverFailure ? <ServerError/> : 
  ( 
    <>
      {loading && <Loading message="Processing data, hold on."/>}
      {emailVerificationPopup && <EmailVerification resendEmailVerificationLink={resendEmailVerificationLink} emailVerificationResendMessage={emailVerificationMessage} resendLoading={resendLoading} responseType={resendVerificationLinkResponse}/>}
      {overlay && <Overlay/>}    
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

          <form onSubmit={submitRegister} style={{width : '90%', maxWidth : '400px'}}>
            <FormControl>
                <Text fontWeight={'bold'}>Username</Text>
                <Input type='text' value={username} onChange={(e) => setUsername(e.target.value)} name='username' border={usernameError != '' ? '2px solid red' : `1px solid ${secondaryColor}`} mb='5px'/>
                <Text fontSize={'12px'} color='red' mb='10px'>{usernameError}</Text>              

                <Text fontWeight={'bold'}>Email Address</Text>
                <Input type='text' value={email} onChange={(e) => setEmail(e.target.value)} name='email' border={emailError != '' ? '2px solid red' : `1px solid ${secondaryColor}`} mb='5px'/>
                <Text fontSize={'12px'} color='red' mb='10px'>{emailError}</Text>                 

                <Text fontWeight={'bold'}>Password</Text>
                <Input type='password' value={password}  onChange={(e) => setPassword(e.target.value)} name='password' border={passwordError != '' ? '2px solid red' : `1px solid ${secondaryColor}`} mb='5px'/>
                <Text fontSize={'12px'} color='red' mb='10px'>{passwordError}</Text>                 

                <Button w='100%' mb='20px' bg={secondaryColor} color='white' height='2.5rem' type="submit">Sign Up</Button>

                <GoogleButton onClick={() => {router.push(GOOGLE_OAUTH_URL)}}/>                
                          
            </FormControl>    
          </form>                
        </Flex>
      </Box>
    </>
  )  
}


export async function getServerSideProps(context){

  const { req, res } = context;


  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, ENVIRONMENT } = publicRuntimeConfig;    


  try {
    const checkAuth = await redirectIfAuthenticated(API_URL + '/auth/login', "GET", req.headers?.cookie || '');

    const { code } = checkAuth;  
  
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



Register.getLayout = (page) => {
  return (
      (page)
  );
}