import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Text, Heading, Box, Flex, VStack} from '@chakra-ui/react'
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
import GameBoard from '@/components/main/GameBoard';
import GamePanel from '@/components/main/GamePanel';
import ReVerifyEmailPopup from '@/components/sub/ReVerifyEmailPopup';
import {transformBoard} from '@/helpers/utils/game';
import constants from "@/config/constants/game"



export default function PlayOnline({userData, serverFailure = false, state}) {

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL } = publicRuntimeConfig;  

  const {colorMode, toggleColorMode} = useColorMode();
  
  const {user, setUser} = useContext(UserContext);  

  const [verifiedEmail, setVerifiedEmail] = useState(true);  
  const [serverError, setServerError] = useState(serverFailure);    
  const [overlay, setOverlay] = useState(false);    
  const [csrfToken, setCsrfToken] = useState('');    

  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");  
  const [resendLoading, setResendLoading] = useState(false);  
  const [resendVerificationLinkResponse, setResendVerificationLinkResponse] = useState(null);    

  const [gameState, setGameState] = useState(state)

  // object of row and col
  const [clickCoordinate, setClickCoordinate] = useState({
      row : null, 
      col : null
  })

  const clickCoordinateHandler = (coordinate, fn) => {
      setClickCoordinate({
        row : coordinate.row, 
        col : coordinate.col
      })
      
      fn()
  } 

  const setGameStateHandler = (newState) => { 
      setGameState(newState)
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
      const preventNavigation = () => {
        window.history.pushState(null, null, window.location.pathname);
      };
  
      preventNavigation();

      const setCSRFToken = async () => {
        const token = await getCsrfToken(API_URL);
        setCsrfToken(token);
      }
      setCSRFToken();




  
      window.addEventListener('popstate', preventNavigation);
  
    } catch (err) {
      setServerError(true);
      return () => {
        window.removeEventListener('popstate', preventNavigation);
      };         
    }

    if (userData){
      if (!userData.email_verified_at){
        setVerifiedEmail(false);
        setOverlay(true);      
      }    
      setUser(userData);

      // TODO : check apakah perlu transform board



    }
    return () => {
      window.removeEventListener('popstate', preventNavigation);
    };         
  }, []);

  useEffect(() => {
    console.log("HAERIN")
    console.log(gameState)
  }, [gameState])

  return (
    serverFailure 
      ? <ServerError/>
      : 
        <>

          {!verifiedEmail && <ReVerifyEmailPopup resendEmailVerificationLink={resendEmailVerificationLink} emailVerificationResendMessage={emailVerificationMessage} resendLoading={resendLoading} responseType={resendVerificationLinkResponse}/>}
          {overlay && <Overlay/>}

          <Flex w="100vw" h="100vh">
            <Flex width="70%" height="auto" justifyContent={"center"} flexDirection={"row"} margin="auto">
              <GameBoard state={gameState} setGameStateHandler={setGameStateHandler} clickCoordinate={clickCoordinate} clickCoordinateHandler={clickCoordinateHandler}/>
              <GamePanel/>
            </Flex>
          </Flex>

        </>
  )
}

export async function getServerSideProps(context){
  const { params, req, res } = context;
  const { game_id } = params;

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL, ENVIRONMENT } = publicRuntimeConfig;     


  try {
      const response = await isAuthenticated(`${API_URL}`, req.cookies?.__SESS_TOKEN, true, game_id);
      
      if (response.code == 200){

        if (response.invalidGameID){

          return {
            redirect: {
              destination: `/play`,
              permanent: true,
            },
          }          
        } 

        // validate if player black then transform the stub
        const stateStub = "............|............|............|............|......p.....|............|.......R....|........k...|............|........K...|............|........k..."
        const stateRows = stateStub.split("|")

        const state = Array(12).fill(null).map((_, row) =>
            Array(12).fill(null).map((_, col) => ({
              character : stateRows[row][col] || ".", 
              characterColor :  stateRows[row][col] != "." && (stateRows[row][col].toLowerCase() == stateRows[row][col] ? "BLACK" : "WHITE"),
              inDefaultPosition : true,
              image : "",
              color : (row + col) % 2 == 0 ? '#B7C0D8' : '#E8EDF9'
            }))
        ) 
                 

        return {
          props : {
            serverFailure : false, 
            userData : response.user,
            state : state
          }
        }
      }
      

      return {
        redirect: {
          destination: `/login`,
          permanent: true,
        },
      }    

  } catch (err) {
      return { props : {serverFailure : true} }
  }

}

PlayOnline.getLayout = (page) => {
  return (
      (page)
  );
}

