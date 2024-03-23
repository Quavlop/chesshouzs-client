import {Card, Flex, Image, Text} from '@chakra-ui/react';
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {Link} from "next/link";
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import MobileDropdownCard from '@/components/sub/MobileDropdownCard';

export default function MobileDropdownList(props){
    const {navs, dropdownRef, mobileDropdownList, toggleMobileDropdownCard} = props;
    const {light, dark} = colorScheme;
    const {maxContentWidth, mobileBreakPoint} = responsiveConfig;    

    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);

    return (
        <Card
            bg={primaryColor}         
            width='150px'
            height='100vh'
            boxShadow={`0 2px 1px 1px ${secondaryColor}`}
            top="50px"
            left='0'
            position='absolute'
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            zIndex={2}

            ref={dropdownRef}
        >
            {
                navs.map(nav => {
                    return  <Flex onClick={() => toggleMobileDropdownCard(nav)} key={nav.id} borderRadius="3px" alignItems='center' _hover={{backgroundColor : primaryHover}} w='100%'>
                                <Image src={nav.main_icon} h="30px" w="30x" mr="10px"/>                        
                                <Text>{nav.title}</Text>
                                {nav.open && <MobileDropdownCard navs={nav.data}/>}
                            </Flex>
                })
            }

        </Card>
    )

}