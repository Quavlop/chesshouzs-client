import { Box, SimpleGrid, Grid,GridItem,Flex, Textarea, Button, VStack, HStack, Text, Image } from '@chakra-ui/react';
import {boardCellColorHandler, handleMovement} from "@/helpers/utils/game"


const GameSquares = ({state, setGameStateHandler, clickCoordinate, clickCoordinateHandler}) => {
  const boardSize = 12;
  const squares = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      squares.push(
        <Box
        key={`${row}-${col}`}
        // bg={(clickCoordinate.row == row && clickCoordinate.col == col) ? "red" : state[row][col]?.color }
        bg={() => boardCellColorHandler(clickCoordinate, {row, col, movable : state[row][col]?.validMove}, state[row][col]?.color)}
        w="100%"
        h="0"
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        onClick={() => clickCoordinateHandler({row, col}, () => {
            const newState = handleMovement(state[row][col]?.character, {row, col}, state)
            if (!newState) return
            setGameStateHandler(newState)
        })}
        pb="100%" // Padding bottom to maintain square aspect ratio
        >
            {/* <Image 
                h='100%'
                w='100%'
                src='/logo/logo.png'
                objectFit={"cover"}
            /> */}
            <Text textAlign={"center"} marginTop="65px">
                {
                    /*TODO : change to image*/
                }
                {state[row][col]?.character != "." && state[row][col]?.character}
            </Text>
        </Box>
      );
    }
  }

  return squares
}

export default  function Board(props){

  return <Grid
  templateColumns="repeat(12, 1fr)"
  gap={0}
  w="100%"
  maxH="800px"
  maxW="800px"
  mx="auto"
  p={0}
  border={"2px solid #B7C0D8"}
  >
    <GameSquares {...props}/>
  </Grid>
}

