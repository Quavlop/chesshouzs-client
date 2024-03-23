import Head from 'next/head'
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import styles from '@/styles/Home.module.css'
import {useColorMode, useColorModeValue} from '@chakra-ui/color-mode';
import {colorScheme, responsiveConfig} from '@/helpers/theme.ts';
import { Text, Heading, Container, Flex, Box, Image, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function Loading({message}){

    const {light, dark} = colorScheme;  

    const primaryColor = useColorModeValue(light.primary, dark.primary);
    const primaryHover = useColorModeValue(light.primaryHover, dark.primaryHover);     
    const primaryShaderColor = useColorModeValue(light.primaryShader, dark.primaryShader);     
    const secondaryColor = useColorModeValue(light.secondary, dark.secondary);
    const secondaryHover = useColorModeValue(light.secondaryHover, dark.secondaryHover); 

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
            maxW='500px'
            zIndex={12}        
        >
            <Spinner color={secondaryColor} thickness='10px' speed='0.8s' w={'150px'} h={'150px'} size="xl" />
            <Heading mt='25px' color='white' fontWeight={'bold'}>{message}</Heading>
        </Flex>
    )
}