import { useRouter } from 'next/router';
import {Card, Flex, Image, Text} from '@chakra-ui/react';
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {Link} from "next/link";
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import DropdownCard from '@/components/sub/DropdownCard';

export default function MobileDropdownCard(props){

    const router = useRouter();

    const {navs} = props;
    const {light, dark} = colorScheme;
    const {maxContentWidth, mobileBreakPoint} = responsiveConfig;    

    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);

    const navigate = (destination) => {
        router.push(destination);
    }

    return (
        <Card
            height='100vh'
            width='150px'
            bg={primaryHover}    
            boxShadow={`2px 1px 3px 0px ${secondaryColor}`}
            position='absolute'     
            top='0'
            left='150' 
            display="flex"
            flexDirection="column"
            alignItems="flex-start"  
            zIndex={2}          
        >

            {
                navs.map((content) => {
                    return <Flex onClick={()=>navigate(content.href)} borderRadius="3px" alignItems='center' _hover={{backgroundColor : primaryShaderColor}} w='100%'>
                        <Image src={content.icon} h="30px" w="30x" mr="10px"/>                        
                        <Text>{content.description}</Text>
                    </Flex>

                })
            }            

        </Card>
    );


}