import { Box, Image, Text } from "@chakra-ui/react";

const skillImage = (name) => {
  if (name === "Fog Master") return "/icons/skills/fog_master.png";
  if (name === "Freezing Wand") return "/icons/skills/freezing_wand.png";
  if (name === "Enlightened Apprentice") return "/icons/skills/enlightened_apprentice.png";
  if (name === "The Great Wall") return "/icons/skills/the_great_wall.png";
  if (name === "Paralyzer") return "/icons/skills/paralyzer.png";
};

const SkillCard = ({ key, data, onClickHandler, myTurn }) => {
  return (
    <Box
      key={key}
      bg={myTurn && data.currentUsageCount > 0 ? "white" : "grey"}
      border="1px solid #B7C0D8"
      borderRadius="md"
      h="auto"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      onClick={() => {
        if (!myTurn || data.currentUsageCount <= 0) {
          return;
        }
        onClickHandler(data);
      }}
    >
      <Image 
        src={skillImage(data.name)} 
        alt={data.name} 
        width="100%" 
        height="100px" 
        mb={2} 
      />
      <Text fontSize="sm" textAlign="center" fontWeight={"bold"}>
        {data.name}
      </Text>
    </Box>
  );
};

export default SkillCard;
