import Head from 'next/head'
import { useRouter } from 'next/router';
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Text, Heading, Box, Flex, Tabs, Image,TabList, TabPanels, Tab, TabPanel,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,  
  Button,
  Input
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
// import socket from '@/config/ClientSocket';
import WebSocketClient from '@/config/WebSocket';
import WebSocketConstants from '@/config/constants/websocket'
import GameConstants from '@/config/constants/game'


export default function Play({userData, serverFailure = false, token = ""}) {

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, GAME_API_REST_URL, GAME_API_WS_URL } = publicRuntimeConfig;  
  const [socket, setSocket] = useState(null);

  const router = useRouter();

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
  
  const [tab, setTab] = useState(1);

  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");  
  const [resendLoading, setResendLoading] = useState(false);  
  const [resendVerificationLinkResponse, setResendVerificationLinkResponse] = useState(null);    


  const [formData, setFormData] = useState({
      type : GameConstants.GAME_TYPE_RAPID,
      time_control : GameConstants.GAME_TIME_CONTROL_600_0,
  });

  useEffect(() => {
    return () => {
      if (socket) socket.close()
    }
  }, [])

  // socket.on('start-game', (game_id) => {
  //   router.push(`/play/${game_id}`);
  //   return;
  // });

  const handleSubmit = async (e) => { 
    console.log(formData)
    e.preventDefault();

    try {
      const ws = WebSocketClient(GAME_API_WS_URL, token, {
        onOpen : () => {
            ws.send(JSON.stringify(
              {
                "event": WebSocketConstants.WS_EVENT_MATCHMAKING,
                "data": formData
              }
            )
          )
        },
        onMessage : () => {},
        onError : () => {},
        onClose : () => {},
      })
      if (ws instanceof Error) throw ws
      setSocket(ws) 
    } catch(err){
      console.error(err)
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
    if (serverFailure || typeof window == 'undefined') return;
    
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

          <Tabs boxShadow="0px 0px 10px 1px grey" isFitted variant='unstyled' maxW='900px' w={{base : '95%', sm : '95%', md : '80%'}} m='0 auto' mt='1rem' colorScheme='blue'>
            <TabList>
              <Tab  borderBottom={tab != 2 && 'none'} onClick={() => setTab(1)} bg={tab == 2 ? '#d4d4d4' : {primaryColor}}>Find Game</Tab>
              <Tab  borderBottom={tab != 1 && 'none'} onClick={() => setTab(2)} bg={tab == 1 ? '#d4d4d4' : {primaryColor}}>Play a Friend</Tab>
            </TabList>
            <TabPanels>
              <TabPanel  borderTop={'none'} bg={primaryColor}>

                <form onSubmit={handleSubmit}>
                  <FormControl>
                    <Flex gap='3rem'>
                      <Text fontSize='1rem'>Time Control</Text>
                      <Box bg='grey' w='8rem' display='flex' justifyContent={'center'}>
                        <Text fontSize='1rem'>{formData.time_control}</Text>
                        <Input type="text" disabled value={formData.time_control} hidden/>
                      </Box>
                    </Flex>            

                    <Flex gap='.5rem' mt='1rem'>
                        <Image src="/icons/test.png" w='1.4rem' h='1.4rem'/>
                        <Text fontSize='1rem'>Bullet</Text>
                    </Flex>
                    <Flex gap='.5rem' w='100%' flexGrow={1}>
                        <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_BULLET, time_control : GameConstants.GAME_TIME_CONTROL_60_0});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>1 min</Button>
                          <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_BULLET, time_control :  GameConstants.GAME_TIME_CONTROL_60_1});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>1 | 1</Button>
                  <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_BULLET, time_control : GameConstants.GAME_TIME_CONTROL_120_0});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>2 | 0</Button>                                             
                    </Flex>

                    <Flex gap='.5rem' mt='1rem'>
                        <Image src="/icons/test.png" w='1.4rem' h='1.4rem'/>
                        <Text fontSize='1rem'>Blitz</Text>
                    </Flex>
                    <Flex gap='.5rem' w='100%' flexGrow={1}>
                        <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_BLITZ, time_control : GameConstants.GAME_TIME_CONTROL_180_0});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>3 min</Button>
                          <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_BLITZ, time_control : GameConstants.GAME_TIME_CONTROL_180_1});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>3 | 1</Button>
                  <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_BLITZ, time_control : GameConstants.GAME_TIME_CONTROL_300_0});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>5 min</Button>                                             
                    </Flex>           

                    <Flex gap='.5rem' mt='1rem'>
                        <Image src="/icons/test.png" w='1.4rem' h='1.4rem'/>
                        <Text fontSize='1rem'>Rapid</Text>
                    </Flex>
                    <Flex gap='.5rem' w='100%' flexGrow={1}>
                        <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_RAPID, time_control : GameConstants.GAME_TIME_CONTROL_600_0});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>10 min</Button>
                          <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_RAPID, time_control : GameConstants.GAME_TIME_CONTROL_900_0});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>15 min</Button>
                  <Button onClick={() => {
                          setFormData({type : GameConstants.GAME_TYPE_RAPID, time_control : GameConstants.GAME_TIME_CONTROL_1200_0});
                        }} w='33%' px='1.5rem' py='.3rem' fontSize='1rem' border={`1px solid ${secondaryColor}`} _hover={{
                          color : 'white',
                          bg : secondaryColor
                      }}>30 min</Button>                                             
                    </Flex>   


                    <Button type='submit' mt='1rem' w='100%' px='1.5rem' py='.3rem' bg={secondaryColor} color='white'>Play</Button>                           

                  </FormControl>    
                </form>                     

  

              </TabPanel>
              <TabPanel  borderTop={'none'} bg={primaryColor}>
            
                <Text>Play with friend</Text>

              </TabPanel>
            </TabPanels>
        </Tabs>          
        </>
  )
}

export async function getServerSideProps(context){
  const { req, res, params } = context;

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, ENVIRONMENT } = publicRuntimeConfig;     


  try {


    const response = await isAuthenticated(API_URL, req.cookies?.__SESS_TOKEN, true);

    if (response.code == 200){


      const findExistingRoom = await fetch(API_URL + `/play/online/find-existing-game`, {
        method : "GET",
        credentials : 'include',
        headers : {
            Cookie : `__SESS_TOKEN=${req.cookies?.__SESS_TOKEN}`
        }
      });

      const parsedResponse = await findExistingRoom.json();      
      if (parsedResponse.code == 200){
          const room = parsedResponse.data;
          return {
            redirect: {
              destination: `/play/${room?.gameID}`,
              permanent: false,
            },          
          }          
      }      
      
      return {
        props : {
          serverFailure : false, 
          userData : response.user, 
          token : req.cookies?.__SESS_TOKEN
        }
      }
    }








      return { props : {serverFailure : false} }      

  } catch (err) {
      return { props : {serverFailure : true} }
  }

}
