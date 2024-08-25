import {Box, Flex, SimpleGrid, Button, Text} from '@chakra-ui/react';
import SkillCard from '../sub/SkillCard';
import constants from '@/config/constants/game';

export default function GamePanel({skillStats, onClickHandler, onHoldSkill, setOnHoldSkillHandler, resetSkillStateHandler, activeSkillSet, myTurn, buffDebuffStatus}){
    return <Flex flexDirection={"column"} justifyContent={"space-between"} mt={{base : "5rem", lg : 0}} width={{base : "100%", lg : "25%"}} alignItems={"center"} h={{base : "auto", lg : "100%"}}>
        <Box 
            bg={"#7B61FF"} 
            width={"100%"} 
            height={{base : "300px", lg : "100%"}} 
            maxW="800px" 
            minW="450px"
            border={"2px solid #B7C0D8"}
        >
            {
                !buffDebuffStatus.debuffState[constants.SKILL_PARALYZER] ? 
                    <>
                        {
                            onHoldSkill && 
                                <Button
                                    onClick={() => resetSkillStateHandler()}
                                >
                                    <Text>Cancel Skill</Text>
                                </Button>
                        }

                        {
                            onHoldSkill 
                                ?   
                                    <>
                                        <Text>{activeSkillSet?.name}</Text>
                                        <Text>{activeSkillSet?.description}</Text>
                                    </>
                                :
                                    <SimpleGrid columns={4} spacing={2} p={"0.5rem"}>
                                        {Array.from({ length: skillStats.data?.length }, (_, index) => (
                                            <SkillCard key={index} data={skillStats.data[index]} onClickHandler={onClickHandler} myTurn={myTurn}/>
                                        ))}
                                    </SimpleGrid>
                        }
                    </>      
                : 
                    <>
                        <Text>You are paralyzed!</Text>
                    </>
            }
           


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