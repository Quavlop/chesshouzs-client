import { Box, SimpleGrid, Grid,GridItem,Flex, Textarea, Button, VStack, HStack, Text, Image, AspectRatio } from '@chakra-ui/react';
import {boardCellColorHandler, handleMovement, invalidKingUnderAttackMoves, transformBoard} from "@/helpers/utils/game"
import { checkIfKingStillHasValidMoves } from '@/helpers/utils/movement';
import { generateNewNotationState } from '@/helpers/utils/game';
import { Chessboard } from 'react-chessboard';
import constants from '@/config/constants/game';
import WebSocketConstants from '@/config/constants/websocket'
import PlayerProfileGameCard from '../sub/PlayerProfileGameCard';
import { isSquareCoveredByFog } from '@/helpers/utils/util';

const GameSquares = ({state, setGameStateHandler, clickCoordinate, clickCoordinateHandler, prevClickedChar, setPrevClickedCharHandler, myTurn, setMyTurnHandler, isInCheck, setIsInCheckHandler, playerGameStatus, setPlayerGameStatusHandler, gameData, wsConn, userData, executeSkill, buffDebuffStatus, enemyBuffDebuffStatus}) => {
  const boardSize = gameData.boardSize;
  const squares = [];
  console.log(buffDebuffStatus)
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      squares.push(
        <Box
        key={`${row}-${col}`}
        // bg={(clickCoordinate.row == row && clickCoordinate.col == col) ? "red" : state[row][col]?.color }
        bg={() => boardCellColorHandler(clickCoordinate, 
          {
            row, col, 
            movable : state[row][col]?.validMove,
            onHoldSkill : state[row][col]?.onHoldSkill, 
            onHoldSkillClickable : state[row][col]?.onHoldSkillClickable,
            selfPieceFrozen : function(){
              var rowState, colState
              if (playerGameStatus.color == "BLACK" ){
                 rowState = state.length - row - 1
                 colState = state.length - col - 1
              } else {
                 rowState = row 
                 colState = col
              }
              return buffDebuffStatus.debuffState[constants.SKILL_FREEZING_WAND][`${rowState}-${colState}`]
            }(),
            enemyPieceFrozen : function(){
              var rowState, colState
              if (playerGameStatus.color == "BLACK" ){
                 rowState = state.length - row - 1
                 colState = state.length - col - 1
              } else {
                 rowState = row 
                 colState = col
              }
              return enemyBuffDebuffStatus.debuffState[constants.SKILL_FREEZING_WAND][`${rowState}-${colState}`]
            }(),
            coveredByFog : function(){
              const map = buffDebuffStatus.debuffState[constants.SKILL_FOG_MASTER]
              if (playerGameStatus.color == "BLACK"){
                return map[`${state.length - row - 1}-${state.length - col - 1}`] && state[state.length - row - 1][state.length - col - 1].characterColor != playerGameStatus.color
              }
              return map[`${row}-${col}`] && state[row][col].characterColor != playerGameStatus.color
            }(),
            isWall : function(){
              return state[row][col].character == "0"
            }()
          }, 
          state[row][col]?.color)
        }
        w="100%"
        h="100%"
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        position={"relative"}
        onClick={() => clickCoordinateHandler({row, col}, () => {
             var rowState, colState
             if (playerGameStatus.color == "BLACK" ){
                rowState = state.length - row - 1
                colState = state.length - col - 1
             } else {
                rowState = row 
                colState = col
             }
            if (buffDebuffStatus.debuffState[constants.SKILL_FREEZING_WAND][`${rowState}-${colState}`]){
              return
            }

            if (!myTurn){
              return
            }

            if (state[row][col].onHoldSkillClickable){
              executeSkill({row, col})
              return
            }
          
            if (state[row][col].onHoldSkill){
              return
            }


            var newState = state.map(row => row.slice());
 
            if (newState[row][col].validMove){
                  newState[row][col] = {
                      character : prevClickedChar.character, 
                      characterColor : prevClickedChar.characterColor,
                      inDefaultPosition : false, 
                      image : prevClickedChar.image, 
                      color : prevClickedChar.color,
                      prevValidMove : true,
                  }
                  newState[prevClickedChar.row][prevClickedChar.col] = {
                    character : ".", 
                    characterColor : false,
                    inDefaultPosition : null, 
                    image : null, 
                    color : (prevClickedChar.row + prevClickedChar.col) % 2 == 0 ? '#B7C0D8' : '#E8EDF9',
                    prevValidMove : false,
                  }
              }

            newState = handleMovement(newState[row][col]?.character, {
              row, col, 
              character : newState[row][col]?.character, 
              characterColor : newState[row][col]?.characterColor,
              validMove : newState[row][col]?.validMove,
            }, newState, playerGameStatus.color)

            if (!newState) {
              return
            }

            setPrevClickedCharHandler({...newState[row][col], row, col})

            var invalidKingMoves = invalidKingUnderAttackMoves(playerGameStatus.kingPosition ,newState,playerGameStatus)
            if (invalidKingMoves.size > 0){ // means that king is in check
              setIsInCheckHandler(true)
            }

            if ((newState[row][col]?.character == constants.CHARACTER_KING || newState[row][col]?.character == constants.CHARACTER_KING.toUpperCase()) && newState[row][col]?.characterColor == playerGameStatus.color){
              setPlayerGameStatusHandler({...playerGameStatus, kingPosition : {
                ...playerGameStatus.kingPosition, row, col
              }})
              for (const cell of invalidKingMoves.keys()) {
                newState[cell.row][cell.col].validMove = false
              } 
              var stillHaveValidMoves = checkIfKingStillHasValidMoves(newState)
              if (!stillHaveValidMoves){
                console.log("CHECKMATED")
              }
            } 


            var stateNotation 
            if (newState[row][col].prevValidMove){
              if (playerGameStatus.color == "WHITE") {
                stateNotation = newState
              } else {
                stateNotation = transformBoard(newState)
              }
              wsConn.send(JSON.stringify(
                {
                  "event" : WebSocketConstants.WS_EVENT_GAME_PUBLISH_ACTION,
                  "data" : {
                    "state" : generateNewNotationState(stateNotation)
                  }
                }
              ))
            }
 
            

            // newState must be gotten from the above ws emit event's response (UPDATE_GAME_STATE)
            // setGameStateHandler(newState)          
        })}
        // pb="100%" // Padding bottom to maintain square aspect ratio
        >
            {/* <Image 
                h='100%'
                w='100%'
                src='/logo/logo.png'
                objectFit={"cover"}
            /> */}
            <Text textAlign={"center"} position={"absolute"} color="black">
                {
                    /*TODO : change to image*/
                }
                {
                              //  const map = buffDebuffStatus.debuffState[constants.SKILL_FOG_MASTER]
                              //  if (playerGameStatus.color == "BLACK"){
                              //  return map[`${state.length - row - 1}-${state.length - col - 1}`]
                              //  }
                              //  return map[`${row}-${col}`]
                }
                {((state[row][col]?.character != "."  && !isSquareCoveredByFog(state, buffDebuffStatus, playerGameStatus.color, row, col)) || (state[row][col]?.validMove && state[row][col].character != ".")) && state[row][col]?.character}
            </Text>
        </Box>
      );
    }
  }

  return squares
}

export default  function Board(props){

  const { gameData, userData, enemyData } = props

  // return
  return   <Box
            w={{base : "100%", lg : "75%"}}
            h="100%"
            maxH="90vw"
            maxW="90vh"
            // bg="orange"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >   
            <PlayerProfileGameCard userData={enemyData}/>

            
            <Box
              w="90%"
              h="90%"
              mb="0.5rem"
              bg="purple"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <AspectRatio ratio={1} w="100%" h="100%" bg="">
                <Box>
                <Grid
                    templateColumns={`repeat(${gameData.boardSize}, 1fr)`}
                    gap={0}
                    w="100%"
                    h="100%"
                    // maxH="1000px"
                    // maxW="1000px"
                    mx="auto"
                    p={0}
                    border={"2px solid #B7C0D8"}
                    >
                      <GameSquares {...props}/>
                    </Grid>
                </Box>
              </AspectRatio>
            </Box>
            
            <PlayerProfileGameCard userData={userData}/>

        </Box>

}

