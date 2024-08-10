import {Box, Flex} from '@chakra-ui/react';



export default function GamePanel(){
    return <Flex flexDirection={"column"} justifyContent={"space-between"} mt={{base : "5rem", lg : 0}} width={{base : "100%", lg : "25%"}} alignItems={"center"} h={{base : "auto", lg : "100%"}}>
        <Box 
            bg={"#7B61FF"} 
            width={"100%"} 
            height={{base : "300px", lg : "100%"}} 
            maxW="800px" 
            minW="450px"
            border={"2px solid #B7C0D8"}
        >

        </Box>
        <Box 
            bg={"#E8EDF9"} 
            // bg={"green"} 
            height={{base : "300px", lg : "100%"}} 
            width={"100%"}
            maxW="800px"
            minW="450px"
            border={"2px solid #B7C0D8"}
        >
            
        </Box>
    </Flex>
}