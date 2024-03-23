import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Text, Heading, Box, Flex, Image, FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router';  
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
  const { API_URL } = publicRuntimeConfig;  

  const router = useRouter();

  const {colorMode, toggleColorMode} = useColorMode();
  const {light, dark} = colorScheme;  
  const primaryColor = useColorModeValue(light.primary, dark.primary);
  const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
  const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
  const secondaryColor = useColorModeValue(light.secondary, dark.secondary);    
  
  const {user, setUser} = useContext(UserContext);  

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [defaultProfilePicture, setDefaultProfilePicture] = useState(null);

  const [verifiedEmail, setVerifiedEmail] = useState(true);  
  const [serverError, setServerError] = useState(serverFailure);    
  const [overlay, setOverlay] = useState(false);    
  const [csrfToken, setCsrfToken] = useState('');    

  const [error, setError] = useState("");  
  const [invalidImage, setInvalidImage] = useState(false);

  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");  
  const [resendLoading, setResendLoading] = useState(false);  
  const [resendVerificationLinkResponse, setResendVerificationLinkResponse] = useState(null);    

  const profilePictureInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

      // Create a FileReader instance
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
  
      reader.readAsDataURL(file);
  };


  const submitChanges = async (e) => {
    e.preventDefault();

    try {

      const data = new FormData();
      data.append("profile_picture", profilePicture); // image klo kosong, return null dalam STRING (ASLINYA null)
      data.append("username", username);
      data.append("email", email);

      const response = await fetch(API_URL + '/user/profile/edit', 
        {
          method : 'PUT',
          headers : {
            'X-CSRF-Token' : csrfToken
          },
          credentials : 'include',
          body : data
        }
      );      

      const parsedResponse = await response.json();
      if (parsedResponse.code == 200){
        router.push('/');
        return;
      }

      if (parsedResponse.code == 400){
        setInvalidImage(true);
        return;
      }

      if (parsedResponse.code == 500) throw new Error();

    } catch (err) {
        setServerError(true);      
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
  }, []);

  useEffect(() => {
    if (user){
        setUsername(user.username)
        setEmail(user.email);
        setDefaultProfilePicture(user.profile_picture || "");
        setProfilePicture(user.profile_picture);
    }
  }, [user]);

  return (
    serverFailure 
      ? <ServerError/>
      : 
        <>

          {!verifiedEmail && <ReVerifyEmailPopup resendEmailVerificationLink={resendEmailVerificationLink} emailVerificationResendMessage={emailVerificationMessage} resendLoading={resendLoading} responseType={resendVerificationLinkResponse}/>}
          {overlay && <Overlay/>}

          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            w={{sm : "100%", md : "70%"}}
            maxW="55rem"
            h="20rem"
            m="0 auto"
            py='3rem'
          >

            <form onSubmit={submitChanges} style={{width : '90%', maxWidth : '400px'}}>
              <FormControl>

                    <Box
                    w='12rem'
                    h='12rem'
                    borderRadius={"full"}
                    position="relative"
                    m='0 auto'                    
                    mb='2rem'
                  >
                    <Input position='absolute' opacity='0' border='none' w='100%' h='100%'
                      type='file'        // JANGAN ADA VALUE NYA        
                      onChange={handleFileChange}
                      name='profile_picture'
                      // ref={profilePictureInputRef}
                    />                        

                    <Image
                        borderRadius='full'
                        boxSize='auto'
                        h='12rem'
                        w='12rem'
                        src={imagePreview 
                              ? imagePreview 
                              : (defaultProfilePicture != "" && defaultProfilePicture != null 
                                  ? defaultProfilePicture 
                                  : '/images/profile_picture.jpg' )}
                        alt=''
                        border={!invalidImage ? `2px solid ${secondaryColor}` : "2px solid red"}
                    /> 
                    <Box
                      w='50px'
                      h='50px'
                      position='absolute'
                      bg='white'
                      borderRadius={'full'}
                      right='0'
                      bottom='0'
                      border={`2px solid ${secondaryColor}`}                
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Image
                          borderRadius='full'
                          h='25px'
                          w='25px'
                          src='icons/edit.png'
                          alt='edit.png'
                      />                   
                    </Box>
                  </Box>                  

  

                  <Text fontWeight={'bold'}>Username</Text>
                  <Input disabled={true} type='text' value={username} onChange={(e) => {setUsername(e.target.value)}} name='username' border={error != '' ? '2px solid red' : `1px solid ${secondaryColor}`} mb='5px'/>
                  <Text fontSize={'12px'} color='red' mb='10px'>{error}</Text>

                  <Text fontWeight={'bold'}>Email Address</Text>
                  <Input disabled={true} type='text' value={email} onChange={(e) => {setEmail(e.target.value)}} name='email' border={error != '' ? '2px solid red' : `1px solid ${secondaryColor}`} mb='5px'/>
                  <Text fontSize={'12px'} color='red' mb='10px'>{error}</Text>                  
    
                  <Button w=
                  '100%' mb='20px' bg={secondaryColor} color='white' height='2.5rem' type="submit">Save Changes</Button>          
              </FormControl>    
            </form>   
             


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
