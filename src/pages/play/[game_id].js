import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Text, Heading, Box, Flex, VStack, AspectRatio} from '@chakra-ui/react'
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
import WebSocketClient from '@/config/WebSocket';
import WebSocketConstants from '@/config/constants/websocket'


export default function PlayOnline({userData, serverFailure = false, state, color, kingData, gameDetail, token}) {

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL,GAME_API_WS_URL } = publicRuntimeConfig;  

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
  const [prevClickedChar, setPrevClickedChar] = useState({})
  const [myTurn, setMyTurn] = useState(gameDetail.myTurn)
  // const [myTurn, setMyTurn] = useState(true)

  const [isInCheck, setIsInCheck] = useState(false)

  const [playerGameStatus, setPlayerGameStatus] = useState({
    color, kingPosition : kingData
  }) 

  const [gameData, setGameData] = useState(gameDetail)
  const [wsConn, setWsConn] = useState(null)

  // object of row and col
  const [clickCoordinate, setClickCoordinate] = useState({
      row : null, 
      col : null
  })

  const clickCoordinateHandler = (coordinate, coordinateHandlerCallback) => {
      setClickCoordinate({
        row : coordinate.row, 
        col : coordinate.col
      })
      coordinateHandlerCallback()
  } 

  const setGameStateHandler = (newState) => { 
      setGameState(newState)
  }

  const setWsConnHandler = (ws) => {
    setWsConn(ws)
  }

  const setPrevClickedCharHandler = (char) => {
      setPrevClickedChar(char)
  }

  const setMyTurnHandler = (bool) => {
    setMyTurn(bool)
  }

  const setIsInCheckHandler = (bool) => {
    setIsInCheck(bool)
  } 

  const setPlayerGameStatusHandler = (status) => {
    setPlayerGameStatus(status)
  }

  const setGameDataHandler = (data) => {
    setGameData(data)
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

      // TODO : connect ws 

      const ws = WebSocketClient(GAME_API_WS_URL, token, {
        onOpen : () => { 
          ws.send(JSON.stringify(
            {
              "event" : WebSocketConstants.WS_EVENT_CONNECT_GAME
              // TODO : check if this event fails (get response from BE)
            }
          ))
        }, 
        onMessage : (event) => {
            const response = JSON.parse(event.data) 
            if (response.status != "SUCCESS") {
              return  
            }
            if (response.event == WebSocketConstants.WS_EVENT_UPDATE_GAME_STATE) {
              setGameState(response.data?.state)
              setMyTurn((response.data?.turn == true && playerGameStatus.color == "WHITE") || (response.data?.turn == false && playerGameStatus.color == "BLACK"))
            }
        },
        onError : () => {},
        onClose : () => {},
      })

      setWsConn(ws)
    }
    return () => {
      window.removeEventListener('popstate', preventNavigation);
    };         
  }, []);

  useEffect(() => {
  }, [gameState])

  return (
    serverFailure 
      ? <ServerError/>
      : 
        <>

          {!verifiedEmail && <ReVerifyEmailPopup resendEmailVerificationLink={resendEmailVerificationLink} emailVerificationResendMessage={emailVerificationMessage} resendLoading={resendLoading} responseType={resendVerificationLinkResponse}/>}
          {overlay && <Overlay/>}

            <Flex w="100vw" h="100vh">
            <Flex width="90%" height="90%" justifyContent={{base : "flex-start", lg : "center"}} flexDirection={{ base: "column", lg : "row" }} alignItems={{base : "center", lg : "flex-start"}} margin={{base : "auto", lg : "none"}} marginTop={{base : "10rem", lg : "auto"}}>
                <GameBoard 
                  state={gameState} 
                  setGameStateHandler={setGameStateHandler} 
                  clickCoordinate={clickCoordinate} 
                  clickCoordinateHandler={clickCoordinateHandler} 
                  prevClickedChar={prevClickedChar}
                  setPrevClickedCharHandler={setPrevClickedCharHandler}
                  myTurn={myTurn}
                  setMyTurnHandler={setMyTurnHandler}
                  isInCheck={isInCheck}
                  setIsInCheckHandler={setIsInCheckHandler}
                  playerGameStatus={playerGameStatus}
                  setPlayerGameStatusHandler={setPlayerGameStatusHandler}
                  gameData={gameData}
                  setGameDataHandler={setGameDataHandler}
                  wsConn={wsConn}
                />
              {/* </AspectRatio> */}
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
  const { API_URL, ENVIRONMENT, GAME_API_REST_URL } = publicRuntimeConfig;     
  var playerColorStub = "WHITE"
  var kingData = null
  var state

  try {
      const response = await isAuthenticated(`${API_URL}`, req.cookies?.__SESS_TOKEN, true, game_id);
      
      if (response.code == 200){

        // if (response.invalidGameID){

        //   return {
        //     redirect: {
        //       destination: `/play`,
        //       permanent: true,
        //     },
        //   }          
        // } 

        const getCurrentActiveMatchData = await fetch(GAME_API_REST_URL + '/v1/match', {
          method : "GET",
          headers : {
              Authorization : `Bearer ${req.cookies?.__SESS_TOKEN}`
          }
        }) 

        const matchDataResp = await getCurrentActiveMatchData.json()
        if (matchDataResp.code != 200){
          return {
            redirect: {
              destination: `/play`,
              permanent: true,
            },
          } 
        }

        console.log(game_id, matchDataResp)
        if (matchDataResp.data.id != game_id) {
          return {
            redirect: {
              destination: `/play`,
              permanent: true,
            },
          }
        }

        // validate if player black then transform the stub
        const stateStub = matchDataResp.data?.gameNotation || ""
        const stateRows = stateStub.split("|")
        console.log(stateRows)
        const boardSizeStub = stateRows.length


        state = Array(boardSizeStub).fill(null).map((_, row) =>
            Array(boardSizeStub).fill(null).map((_, col) => {
              var cellData = {
                character : stateRows[row][col] || ".", 
                characterColor :  stateRows[row][col] != "." && (stateRows[row][col].toLowerCase() == stateRows[row][col] ? "BLACK" : "WHITE"),
                inDefaultPosition : stateRows[row][col] != null ? true : null,
                image : "",
                color : (row + col) % 2 == 0 ? '#B7C0D8' : '#E8EDF9'
              }
              if ((stateRows[row][col] == constants.CHARACTER_KING || stateRows[row][col] == constants.CHARACTER_KING.toUpperCase()) && cellData.characterColor == playerColorStub){
                kingData = {
                  inDefaultPosition : cellData.inDefaultPosition, 
                  row, col 
                }
              }

              return cellData
            })
        )  

        const myTurn = response.user?.id == matchDataResp.data?.whitePlayer.id;
        playerColorStub = myTurn ? "WHITE" : "BLACK"
        if (playerColorStub == "BLACK"){
          state = transformBoard(state)
        }
        

        const gameDetail = {
          boardSize : boardSizeStub,
          myTurn
        }
                 

        return {
          props : {
            serverFailure : false, 
            userData : response.user,
            state : state, 
            color : playerColorStub, 
            kingData,
            gameDetail, 
            token : req.cookies?.__SESS_TOKEN
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
      console.log(err);
      return { props : {serverFailure : true} }
  }

}

PlayOnline.getLayout = (page) => {
  return (
      (page)
  );
}

