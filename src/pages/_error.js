import { useRouter } from 'next/router';
import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState, useRef } from 'react';
import { Text, Heading, Box, Flex, Image, Button, Fade, ScaleFade, Slide, SlideFade  } from '@chakra-ui/react'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import { keyframes } from '@chakra-ui/react';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';

export default function ServerError(){

    const router = useRouter();

    const {colorMode, toggleColorMode} = useColorMode();
  
    const {light, dark} = colorScheme;
    const {maxContentWidth, mobileBreakPoint} = responsiveConfig;  
      
    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);  
    const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover);    
    
  
    const [width, setWidth] = useState();

    const updateDimension = () => {
        if (typeof window !== "undefined"){
            setWidth(window.innerWidth);
        }
      }    

      useEffect(() => {
        updateDimension();
        window.addEventListener("resize", updateDimension);       
        return () => {
            window.removeEventListener("resize", updateDimension);               
        }
      }, []);        

    return (
        <Flex
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            maxWidth={'100%'}
            height={'100vh'}
            px={width < 750 && '20px'}            
            >               
            <Image 
                h='auto'
                w='350px'
                src='/images/landing-image-1.png'
                />
            <Heading fontSize={width < 390 ? '20px' : '50px'} mb={'5px'} opacity={'0.3'} textAlign={'center'}>500</Heading>                 
            <Heading fontSize={width < 390 ? '20px' : '28px'} mb={'5px'} textAlign={'center'}>Internal Server Error</Heading>
            <Text fontSize={width < 390 ? '14px' : '14px'}   mb={'8px'} textAlign={'center'}>We're sorry for the inconvenience.</Text>
            <Flex
                justifyContent={'center'}
                alignItems={'center'}  
                flexDirection={width > 522 ? 'row' : 'column-reverse'}
                gap='1rem'          
                height={width > 522 ? '50px' : 'auto'} width={width > 337 ? '30%' : '90%'} 
                maxW='500px' 
                minW={width > 522 ? '450px' : '100%'} 
                px='5px'
            >
                <Button onClick={()=>{router.push('/')}} height={width > 522 ? '100%' : '50px'} width={'90%'} bg='none' whiteSpace={'normal'} wordBreak={'break-word'} border={`1px solid ${secondaryColor}`} color={secondaryColor} _hover={{
                        color : secondaryHover,
                        bg : primaryHover,
                        border : `1px solid ${secondaryHover}`
                    }}>Go to Home Page</Button>  
            </Flex>

        </Flex>
    )
}

ServerError.getLayout = (page) => {
    return (
        (page)
    );
}