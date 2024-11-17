import { Box, SimpleGrid, Grid,GridItem,Flex, Textarea, Button, VStack, HStack, Text, Image, AspectRatio } from '@chakra-ui/react';

const PlayerProfileGameCard = ({ userData, duration, durationList, self }) => {
    return (
      <Flex justify="space-between" h={"90%"} maxH={"120px"} w={"90%"} align="center" p={4} bg="#7B61FF" borderRadius="md" boxShadow="md" mb={2}>
        <HStack spacing={4}>
          <Image
            boxSize="50px"
            borderRadius="full"
            src={userData.profile_picture || '/images/profile_picture.jpg'} // User's profile picture URL
            alt={userData.username}
          />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg" color="white">
              {userData.username}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.800">
              {userData.elo}
            </Text>
          </VStack>
        </HStack>
        <Text 
          fontSize="2xl" 
          fontWeight="bold" 
          color="white" 
          fontFamily="mono"
        >
          {self ? durationList.self : durationList.enemy}
        </Text>        
      </Flex>
    );
  };


export default PlayerProfileGameCard