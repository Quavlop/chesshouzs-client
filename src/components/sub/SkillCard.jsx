import { Box } from "@chakra-ui/react"

const SkillCard = ({key}) => {
    return <Box
        key={key}
        bg="white"
        border="1px solid #B7C0D8"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        h="100px"
        minH={0}
    >
    </Box>    
}

export default SkillCard