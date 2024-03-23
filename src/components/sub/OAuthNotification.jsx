import Head from 'next/head'
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import styles from '@/styles/Home.module.css'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import { Text, Heading, Container, Flex, Box, Image, Button, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function OAuthNotification({message, handleClose}){

    const config = getConfig();
    const { publicRuntimeConfig } = config;
    const { API_URL } = publicRuntimeConfig;    
  
    const {light, dark} = colorScheme;  
  
    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
    const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover)  


    return (
        <Flex
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            position='fixed'
            left='0'
            right='0'
            top='0'
            bottom='0'
            margin='auto'
            w='100%'
            h='350px'
            px='1.5rem'
            py='1.5rem'
            maxW='500px'
            textAlign={'center'}
            bgColor={'white'}
            zIndex={11}
        >
            <Heading
                lineHeight={'2.2rem'}
                fontSize={'1.5rem'}            
            >
                Failed to sign in with Google
            </Heading>

            <Text
                fontSize={'1rem'}
                color='red'
            >
                {message}
            </Text>      
            
            <Button
                bgColor='none' 
                border={`1px solid ${secondaryColor}`}
                color={secondaryColor}
                onClick={handleClose}
                h='auto'
                py='1rem'
                px='.4rem'
                width='50%'
                maxW='300px'
                mt='20px'
                _hover={{
                    color : 'white',
                    bg : secondaryColor            
                }}

            >
                Close
            </Button>            




        </Flex>        
    )
}