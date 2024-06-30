import {Box, Flex} from '@chakra-ui/react';



export default function GamePanel(){
    return <Flex flexDirection={"column"} justifyContent={"space-between"} width="450px" marginRight={"10px"}>
        <Box 
            width={"100%"} 
            height={"48%"} 
            bg={"#E8EDF9"} 
            maxW="800px" 
            minW="450px"
            border={"2px solid #B7C0D8"}
        >

        </Box>
        <Box 
            bg={"#E8EDF9"} 
            height={"48%"}
            width={"100%"}
            maxW="800px"
            minW="450px"
            border={"2px solid #B7C0D8"}
        >
            
        </Box>
    </Flex>
}