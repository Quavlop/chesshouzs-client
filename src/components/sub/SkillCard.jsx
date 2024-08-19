import { Box } from "@chakra-ui/react"

const SkillCard = ({key, data, onClickHandler, myTurn}) => {
    return <Box
        key={key}
        bg={myTurn && data.currentUsageCount > 0 ? "white" : "grey"}
        border="1px solid #B7C0D8"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        h="100px"
        minH={0}
        onClick={() => {
            if (!myTurn || data.currentUsageCount <= 0) {
                return
            }
            onClickHandler(data)
        }}
    >
        {data.name}
    </Box>    
}

export default SkillCard