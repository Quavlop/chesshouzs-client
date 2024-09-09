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
import {findKing, handleMovement, invalidKingUnderAttackMoves, isWall, kingCheck, pawnCheck, transformBoard} from '@/helpers/utils/game';
import { triggerEndGame, triggerSkills } from '@/helpers/skills/trigger'
import { constructBuffDebuffStatusMap, resetSkillBoardStats } from '@/helpers/utils/util'
import { execute } from '@/helpers/skills/execution'
import constants from "@/config/constants/game"
import WebSocketClient from '@/config/WebSocket';
import WebSocketConstants from '@/config/constants/websocket'
import InfoModal from '@/components/sub/InfoModal'
import { checkEliminateKingAttackerMoves, checkIfDraw, checkIfKingStillHasValidMoves, isOtherPieceMovable, isOtherPieceMovableForCheckmate } from '@/helpers/utils/movement'


export default function PlayOnline({gameId, userData, serverFailure = false, state, color, kingData, gameDetail, token, enemyData, skillStats, playerBuffDebuffStatus, enemyBuffDebuffStatus}) {

  const config = getConfig();
  const { publicRuntimeConfig } = config;
  const { API_URL,GAME_API_WS_URL, GAME_API_REST_URL } = publicRuntimeConfig;  

  const {colorMode, toggleColorMode} = useColorMode();
  
  const {user, setUser} = useContext(UserContext);  

  const [verifiedEmail, setVerifiedEmail] = useState(true);  
  const [serverError, setServerError] = useState(serverFailure);    
  const [overlay, setOverlay] = useState(false);    
  const [csrfToken, setCsrfToken] = useState('');    

  const [onHoldSkill, setOnHoldSkill] = useState(false);

  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");  
  const [resendLoading, setResendLoading] = useState(false);  
  const [resendVerificationLinkResponse, setResendVerificationLinkResponse] = useState(null);    

  const [gameState, setGameState] = useState(state)
  const [prevClickedChar, setPrevClickedChar] = useState({})
  const [myTurn, setMyTurn] = useState(gameDetail.myTurn)
  // const [myTurn, setMyTurn] = useState(true)

  const [buffDebuffStatus, setBuffDebuffStatus] = useState(playerBuffDebuffStatus)
  const [opponentBuffDebuffStatus, setOpponentBuffDebuffStatus] = useState(enemyBuffDebuffStatus)

  const [isInCheck, setIsInCheck] = useState(false)

  const [playerGameStatus, setPlayerGameStatus] = useState({
    color, kingPosition : kingData
  }) 

  const [gameData, setGameData] = useState(gameDetail)
  const [wsConn, setWsConn] = useState(null)
  const [activeSkillSet, setActiveSkillSet] = useState(null)
  const [isInfoModalActive, setIsInfoModalActive] = useState(false)
  const [infoModalData, setInfoModalData] = useState({
    title : "", 
    message : "",
  })

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

  const setOnHoldSkillHandler = (bool) => {
    setOnHoldSkill(bool)
  }

  const setActiveSkillSetHandler = (skill) => {
      setActiveSkillSet(skill)
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

      const ws = WebSocketClient(GAME_API_WS_URL, token, {
        onOpen : () => { 
          ws.send(JSON.stringify(
            {
              "event" : WebSocketConstants.WS_EVENT_CONNECT_GAME
              // TODO : check if this event fails (get response from BE)
            }
          ))
        }, 
        onMessage : async (event) => {
            const response = JSON.parse(event.data) 
            if (response.status != "SUCCESS") {
              return  
            }
            if (response.event == WebSocketConstants.WS_EVENT_UPDATE_GAME_STATE) {

                var state = response.data?.state 
                if (state.endsWith("|")){
                  state = state.slice(0,-1)
                }
                var newState
                var cloneState


                const stateRows = state.split("|")
                const boardSize = stateRows.length

                newState = Array(boardSize).fill(null).map((_, row) =>
                  Array(boardSize).fill(null).map((_, col) => {
                    var cellData = {
                      character : stateRows[row][col] || ".", 
                      characterColor :  (stateRows[row][col] != "." && stateRows[row][col] != "0") && (stateRows[row][col].toLowerCase() == stateRows[row][col] ? "BLACK" : "WHITE"),
                      inDefaultPosition : function(){
                        return stateRows[row][col] != null ? true : null
                      }(),
                      image : "",
                      color : (row + col) % 2 == 0 ? '#B7C0D8' : '#E8EDF9'
                    }
                    if ((stateRows[row][col] == constants.CHARACTER_KING || stateRows[row][col] == constants.CHARACTER_KING.toUpperCase()) && cellData.characterColor == playerGameStatus.color){
                      setPlayerGameStatus({...playerGameStatus, kingPosition : {
                        inDefaultPosition : cellData.inDefaultPosition, 
                        row, col 
                      }})
                    }
      
                    return cellData
                  })
              )

              cloneState = Array(boardSize).fill(null).map((_, row) =>
                Array(boardSize).fill(null).map((_, col) => {
                  var cellData = {
                    character : stateRows[row][col] || ".", 
                    characterColor :  (stateRows[row][col] != "." && stateRows[row][col] != "0") && (stateRows[row][col].toLowerCase() == stateRows[row][col] ? "BLACK" : "WHITE"),
                    inDefaultPosition : function(){
                      return stateRows[row][col] != null ? true : null
                    }(),
                    image : "",
                    color : (row + col) % 2 == 0 ? '#B7C0D8' : '#E8EDF9'
                  }
                  return cellData
                })
             )
            
              
              if (playerGameStatus.color == "WHITE"){
                cloneState = transformBoard(cloneState)
              }
            

              if (playerGameStatus.color == "BLACK"){
                newState = transformBoard(newState) 
                setGameState(newState)
              } else {
                setGameState(newState)
              } 

              if (checkIfDraw(newState)){
                console.log("DRAW")
                const success = triggerEndGameWrapper(gameId, token, userData.id, "DRAW")
                // if (success){
                //   setOverlay(true)
                //   setIsInfoModalActive(true)
                //   setInfoModalData({
                //     title : "GAME HAS ENDED!", 
                //     message : "DRAW"
                //   })
                // }
                return
              }

              const myKing = findKing(newState, playerGameStatus.color)
              const king = findKing(cloneState, playerGameStatus.color == "BLACK" ? "WHITE" : "BLACK")
              // check & checkmate auto check
              console.log(king)
              console.log(myKing)

              // automate checkmate and incheck
              if (king.row != undefined && king.col != undefined){
                var row = king.row 
                var col = king.col
                cloneState = handleMovement(cloneState[row][col]?.character, {
                  row, col, 
                  character : cloneState[row][col]?.character, 
                  characterColor : cloneState[row][col]?.characterColor,
                  validMove : cloneState[row][col]?.validMove,
                }, cloneState, playerGameStatus.color == "BLACK" ? "WHITE" : "BLACK")

                // if (playerGameStatus.color == "WHITE"){
                  setPlayerGameStatusHandler({...playerGameStatus, kingPosition : {
                    ...playerGameStatus.kingPosition, 
                    row : king.row, col : king.col
                  }})
                // } else {
                  // setPlayerGameStatusHandler({...playerGameStatus, kingPosition : {
                    // ...playerGameStatus.kingPosition, row : cloneState.length - king.row - 1, col : cloneState.length - king.col - 1
                  // }})
                // }

                var enemyPlayerGameStatus = {
                  color : playerGameStatus.color == "BLACK" ? "WHITE" : "BLACK", 
                  kingPosition : {
                    inDefaultPosition : true, 
                    row, col
                  }
                }
                var invalidKingMoves = invalidKingUnderAttackMoves(enemyPlayerGameStatus.kingPosition ,cloneState, enemyPlayerGameStatus)
                var moveCheck = {
                  stillHaveValidMove : false
                }
                if (invalidKingMoves.map.size > 0){ // means that king is in check
                  // if (!kingCheck(cloneState[row][col].character).valid){
                    var kingHaveMoves = checkIfKingStillHasValidMoves(cloneState)
                    if (!kingHaveMoves){
                      moveCheck = checkEliminateKingAttackerMoves(cloneState, invalidKingMoves.source, {...playerGameStatus.kingPosition, row : king.row, col : king.col}, playerGameStatus.color == "BLACK" ? "WHITE" : "BLACK")
                      cloneState = moveCheck.cloneState
                    }
                    console.log(" KING IS IN CHECK")

                  // }
                  // setIsInCheckHandler(true)
                } else { // king is not in check

                  var stillHaveValidMoves = checkIfKingStillHasValidMoves(cloneState)
                  if (((response.data?.turn == true && playerGameStatus.color == "BLACK") || (response.data?.turn == false && playerGameStatus.color == "WHITE")) && !stillHaveValidMoves && !isOtherPieceMovable(cloneState, playerGameStatus.color)){
                    console.log("STALEMATE")
                    const success = triggerEndGameWrapper(gameId, token, userData.id, "STALEMATE")
                    // if (success){
                    //   setOverlay(true)
                    //   setIsInfoModalActive(true)
                    //   setInfoModalData({
                    //     title : "GAME HAS ENDED!", 
                    //     message : "STALEMATE"
                    //   })
                    // }
                    return 
                  }
                  // moveCheck = checkEliminateKingAttackerMoves(cloneState, null, playerGameStatus.kingPosition)
                  // if (!moveCheck.stillHaveValidMove){
                  //   console.log("STALEMATE")
                  // }
                  // cloneState = moveCheck.cloneState
                  // TODO : FE end game 
                  // TODO : encrypt payload
                  // TODO : implement promotion
                  // setIsInCheckHandler(false)
                }

                for (const cell of invalidKingMoves.map.keys()) {
                  cloneState[cell.row][cell.col].validMove = false
                } 

                if (invalidKingMoves.map.size > 0){
                  var stillHaveValidMoves = checkIfKingStillHasValidMoves(cloneState)
                  const otherPieceMovable = isOtherPieceMovableForCheckmate(cloneState, enemyPlayerGameStatus.color, invalidKingMoves.source, enemyPlayerGameStatus.kingPosition)
                  if (!stillHaveValidMoves && !moveCheck.stillHaveValidMove && !otherPieceMovable){
                    console.log("CHECKMATED")
                    const success = triggerEndGameWrapper(gameId, token, userData.id, "CHECKMATE")
                    // if (success){
                      // setOverlay(true)
                      // setIsInfoModalActive(true)
                      // setInfoModalData({
                      //   title : "GAME HAS ENDED!", 
                      //   message : "CHECKMATE"
                      // })
                    // }
  
  
                    for (let row = 0; row < boardSize; row++){
                      for (let col = 0; col < boardSize; col++){
                         cloneState[row][col].validMove = false
                      }
                    }
  
                    return
                  } else {
                    console.log("WK")
                  }
                } 
              } 

              setPlayerGameStatusHandler({...playerGameStatus, kingPosition : {
                ...playerGameStatus.kingPosition, row : myKing.row, col : myKing.col
              }})



              for (let row = 0; row < boardSize; row++){
                for (let col = 0; col < boardSize; col++){
                   newState[row][col].validMove = false
                }
              }

              // TODO : samain logic nya di gameboard smaa disini buat cek checkmate




              setMyTurn((response.data?.turn == true && playerGameStatus.color == "WHITE") || (response.data?.turn == false && playerGameStatus.color == "BLACK"))
              setActiveSkillSet(null)
              setOnHoldSkill(false)
              

              // get earliest player state
              const getPlayerSkillStatus = await fetch(GAME_API_REST_URL + '/v1/match/player/status?isOpponent=0', {
                method : "GET",
                headers : {
                    Authorization : `Bearer ${token}`
                }
              }) 
          
              const playerSkillStatus = await getPlayerSkillStatus.json()
              if (playerSkillStatus.code != 200){
                  console.log("FAILS")
                  return
              }
              const playerSkillStatusMap = constructBuffDebuffStatusMap(playerSkillStatus, skillStats, gameState.length)
              setBuffDebuffStatus(playerSkillStatusMap)

              // enemy earliest player state
              const getEnemySkillStatus = await fetch(GAME_API_REST_URL + '/v1/match/player/status?isOpponent=1', {
                method : "GET",
                headers : {
                    Authorization : `Bearer ${token}`
                }
              }) 
      
              const enemySkillStatus = await getEnemySkillStatus.json()
              if (playerSkillStatus.code != 200){
                console.log("FAILS")
                return
              }
              const enemySkillStatusMap = constructBuffDebuffStatusMap(enemySkillStatus, skillStats, gameState.length)
              setOpponentBuffDebuffStatus(enemySkillStatusMap)
            } else if (response.event == WebSocketConstants.WS_EVENT_END_GAME) {
                setOverlay(true)
                setIsInfoModalActive(true)

                const { data } = response
                var title, message

                if (data?.winnerId == userData.id){

                  if (data?.type == "CHECKMATE"){
                     title = "YOU WON!"
                     message = "You just checkmated your enemy. What the sigma?"
                  } else if (data?.type == "RESIGN"){
                     title = "YOU WON!"
                     message = "Your enemy just gave up."
                  } else if (data?.type == "STALEMATE"){  
                     title = "DRAW!"
                     message = "Stalemate. LOL"
                  } else if (data?.type == "DRAW"){
                     title = "DRAW!"
                     message = "Good game for both of you."
                  } else if (data?.type == "TIMEOUT"){
                     title = "YOU WON!"
                     message = "Your enemy spent too much time sleeping xD"
                  }
                } else if (data?.loserId == userData.id){

                  if (data?.type == "CHECKMATE"){
                     title = "YOU LOST!"
                     message = "Blud got checkmated. -10000 aura"
                  } else if (data?.type == "RESIGN"){
                     title = "YOU LOST!"
                     message = "Bruh are you a coward?"
                  } else if (data?.type == "STALEMATE"){
                     title = "DRAW!"
                     message = "Stalemate. LOL"
                  } else if (data?.type == "DRAW"){
                     title = "DRAW!"
                     message = "Good game for both of you."
                  } else if (data?.type == "TIMEOUT"){
                     title = "YOU LOST!"
                     message = "Did you fall asleep?"
                  }
                } else {
                  return
                }
                setInfoModalData({title, message})

            }
        },
        onError : () => {},
        onClose : () => {},
      })
      
      setWsConn(ws)
    }
    return () => {
      window.removeEventListener('popstate', preventNavigation);
      if (wsConn){
        wsConn.close()
      }
    };         
  }, []);

  useEffect(() => {
  }, [gameState]) 

  const triggerEndGameWrapper = async (gameId, token, winnerId = "", type) => {
      const data = await triggerEndGame(GAME_API_REST_URL ,gameId, token, winnerId, type)
      if (data.code != 200){
        console.log("Fails") 
        return {
          success : false, 
          message : data.message
        }
      }
      console.log(data)
      return {
        success : true
      }

  }

  const executeSkillWrapper = async (position) => {
    /*
      position : {
        row : *** 
        col : ***
      }
    */

    const args = {
        position, 
        gameId,
        playerId : userData?.id, 
    }

    /*
      DOC : 
      execute() returns the new state of the data post-skill trigger
    */

    var preState = gameState
    if (playerGameStatus.color == "BLACK"){
      preState = transformBoard(gameState)
      args.position = {
        row : gameState.length - position.row - 1,
        col : gameState.length - position.col - 1,
      }
    }

    const data = await execute(activeSkillSet, preState, args, GAME_API_REST_URL, token)
    if (data.code != 200){
        console.log("FAILS")
        return
    }
    console.log(data)
  }

  const triggerSkillsWrapperHandler = async (skill) => {

    const args = {
      position : {}, 
      gameId,
      playerId : userData?.id, 
    }

    if (skill.autoTrigger){
      const data = await execute(skill, gameState, args, GAME_API_REST_URL, token)
      if (data.code != 200){
          console.log("FAILS")
      }
      return
    }

    const preprocess = triggerSkills(skill, playerGameStatus?.color, gameState)
    const { state } = preprocess

    if (!skill.autoTrigger){
      setOnHoldSkill(true)
    }

    setActiveSkillSet(skill)
    setGameState(state)
    
    // return result
  }

  const resetSkillStateWrapperHandler = (state) => {
    const newState = resetSkillBoardStats(state) 
    setGameState(newState)
    setOnHoldSkill(false)
  }

  // TODO : move show modal end game to end_game event emit from BE

  return (
    serverFailure 
      ? <ServerError/>
      : 
        <>

          {!verifiedEmail && <ReVerifyEmailPopup resendEmailVerificationLink={resendEmailVerificationLink} emailVerificationResendMessage={emailVerificationMessage} resendLoading={resendLoading} responseType={resendVerificationLinkResponse}/>}
          {overlay && <Overlay/>}
          {isInfoModalActive && <InfoModal title={infoModalData.title} message={infoModalData.message}/>}

            <Flex w="100vw" h="100vh" bg={onHoldSkill ? "#454545" : "#F4F4F4"}>
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
                  userData={userData}
                  enemyData={enemyData} 
                  executeSkill={executeSkillWrapper}
                  buffDebuffStatus={buffDebuffStatus}
                  enemyBuffDebuffStatus={opponentBuffDebuffStatus}
                  triggerEndGameWrapper={() => triggerEndGameWrapper(gameId, token, enemyData.id, "CHECKMATE")}
                />
              {/* </AspectRatio> */}
              <GamePanel 
                skillStats={skillStats} 
                onClickHandler={triggerSkillsWrapperHandler} 
                onHoldSkill={onHoldSkill}
                setOnHoldSkillHandler={setOnHoldSkillHandler}
                resetSkillStateHandler={() => resetSkillStateWrapperHandler(gameState)}
                activeSkillSet={activeSkillSet}
                buffDebuffStatus={buffDebuffStatus}
                myTurn={myTurn}
                />
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

        if (matchDataResp.data.id != game_id) {
          return {
            redirect: {
              destination: `/play`,
              permanent: true,
            },
          }
        }

        const getPlayerSkillStats = await fetch(GAME_API_REST_URL + '/v1/match/skills', {
          method : "GET",
          headers : {
              Authorization : `Bearer ${req.cookies?.__SESS_TOKEN}`
          }
        }) 

        const skillStats = await getPlayerSkillStats.json()
        if (skillStats.code != 200){
          return {
            redirect: {
              destination: `/play`,
              permanent: true,
            },
          } 
        }

        playerColorStub = matchDataResp.data?.whitePlayer.id == response.user?.id ? "WHITE" : "BLACK";
        const enemyData = playerColorStub == "WHITE" ? matchDataResp.data?.blackPlayer : matchDataResp.data?.whitePlayer;
        const myTurn = matchDataResp.data?.turn == playerColorStub;



        // validate if player black then transform the stub
        var stateStub = matchDataResp.data?.gameNotation || ""
        if (stateStub.endsWith("|")){
          stateStub = stateStub.slice(0, -1)
        }
        const stateRows = stateStub.split("|")
        const boardSizeStub = stateRows.length


        // self
        const getPlayerSkillStatus = await fetch(GAME_API_REST_URL + '/v1/match/player/status?isOpponent=0', {
          method : "GET",
          headers : {
              Authorization : `Bearer ${req.cookies?.__SESS_TOKEN}`
          }
        }) 

        const playerSkillStatus = await getPlayerSkillStatus.json()
        if (playerSkillStatus.code != 200){
          return {
            redirect: {
              destination: `/play`,
              permanent: true,
            },
          } 
        }
        const playerSkillStatusMap = constructBuffDebuffStatusMap(playerSkillStatus, skillStats, boardSizeStub)

        // enemy 
        const getEnemySkillStatus = await fetch(GAME_API_REST_URL + '/v1/match/player/status?isOpponent=1', {
          method : "GET",
          headers : {
              Authorization : `Bearer ${req.cookies?.__SESS_TOKEN}`
          }
        }) 

        const enemySkillStatus = await getEnemySkillStatus.json()
        if (enemySkillStatus.code != 200){
          return {
            redirect: {
              destination: `/play`,
              permanent: true,
            },
          } 
        }
        const enemySkillStatusMap = constructBuffDebuffStatusMap(enemySkillStatus, skillStats, boardSizeStub)


        state = Array(boardSizeStub).fill(null).map((_, row) =>
            Array(boardSizeStub).fill(null).map((_, col) => {
              var cellData = {
                character : stateRows[row][col] || ".", 
                characterColor :  (stateRows[row][col] != "." && stateRows[row][col] != "0") && (stateRows[row][col].toLowerCase() == stateRows[row][col] ? "BLACK" : "WHITE"),
                inDefaultPosition : function(){
                  return stateRows[row][col] != null ? true : null
                }(),
                image : "",
                color : (row + col) % 2 == 0 ? '#B7C0D8' : '#E8EDF9'
              }
              // if ((stateRows[row][col] == constants.CHARACTER_KING || stateRows[row][col] == constants.CHARACTER_KING.toUpperCase()) && cellData.characterColor == playerColorStub){
  
              // }

              return cellData
            })
        )  


        if (playerColorStub == "BLACK"){
          state = transformBoard(state)
        }

        const king = findKing(state, playerColorStub)
        if (king.row && king.col){
          kingData = {
            inDefaultPosition : true, 
            row : king.row, col : king.col
          }
        }
        

        const gameDetail = {
          boardSize : boardSizeStub,
          myTurn
        }

                 
        return {
          props : {
            gameId : game_id,
            serverFailure : false, 
            userData : response.user,
            enemyData,
            state : state, 
            color : playerColorStub, 
            kingData,
            gameDetail, 
            skillStats,
            playerBuffDebuffStatus : playerSkillStatusMap,
            enemyBuffDebuffStatus : enemySkillStatusMap,
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

