import {Box, Flex} from '@chakra-ui/react';



export default function GamePanel(){
    return <Flex flexDirection={"column"} justifyContent={"space-between"} width={{base : "100%", lg : "30%"}} alignItems={"center"} h={{base : "auto", lg : "100%"}}>
        <Box 
            bg={"blue"} 
            width={"100%"} 
            height={{base : "300px", lg : "100%"}} 
            maxW="800px" 
            minW="450px"
            border={"2px solid #B7C0D8"}
        >

        </Box>
        <Box 
            // bg={"#E8EDF9"} 
            bg={"green"} 
            height={{base : "300px", lg : "100%"}} 
            width={"100%"}
            maxW="800px"
            minW="450px"
            border={"2px solid #B7C0D8"}
        >
            
        </Box>
    </Flex>
}