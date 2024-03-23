import { useRouter } from 'next/router';
import {Card, Flex, Image, Text} from '@chakra-ui/react';
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {Link} from "next/link";
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';

export default function DropdownCard(props){

    const router = useRouter();

    const {nav, dropdownRef} = props;
    const {light, dark} = colorScheme;
    const {maxContentWidth, mobileBreakPoint} = responsiveConfig;    

    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
    const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover);  

    const navigate = (destination) => {
        router.push(destination);
    }

    return (
        <Card 
            height='auto'
            width='150px'
            borderRadius='3px'
            boxShadow={`0 0 10px 3px ${primaryShaderColor}`}
            ref={dropdownRef}
            bg={primaryColor} 
            position='absolute'
            top="50px"
            left="0"
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            px='2px'
            py='2px'
            zIndex={2}
            >
            {
                nav.data.map((content) => {
                    return <Flex onClick={() => navigate(content.href)} borderRadius="3px" alignItems='center' _hover={{backgroundColor : primaryHover}} w='100%'>
                        <Image src={content.icon} h="30px" w="30x" mr="10px"/>                        
                        <Text>{content.description}</Text>
                    </Flex>
                })                    
            }
        
        </Card>          
    )
}